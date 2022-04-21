use wasm_bindgen::prelude::*;
use array_init::array_init;
use arrayvec::ArrayVec;
use js_sys::Date;

use crate::config::constants::*;
use crate::physics::rigidbody::Body;
use crate::vec3::vec3f::Vec3f;

#[wasm_bindgen]
pub struct Instance {
    bodies: Vec<Body>,
    cam_pos: Vec3f,
    march_vec: Vec3f,
    wipe_height: usize,
    camera_index: usize,
    screen_out: [ArrayVec<u8, SCREEN_WIDTH>; SCREEN_HEIGHT],
    screen_data: [ArrayVec<f32, SCREEN_WIDTH>; SCREEN_HEIGHT],
    screen_rays: [ArrayVec<(Vec3f, bool), SCREEN_WIDTH>; SCREEN_HEIGHT],
    timer: f64,
    time_scale: f64,
}
#[wasm_bindgen]
impl Instance {
    pub fn new(cam_pos: Vec3f, march_vec: Vec3f, wipe_height: usize, time_scale: f64) -> Instance {
        let mut inst : Instance = Instance {
            bodies: Vec::<Body>::new(),
            cam_pos: cam_pos,
            march_vec: march_vec,
            wipe_height: wipe_height,
            camera_index: 0,
            screen_out: array_init::array_init(|_| ArrayVec::<u8, SCREEN_WIDTH>::new()),
            screen_data: array_init::array_init(|_| ArrayVec::<f32, SCREEN_WIDTH>::new()),
            screen_rays: array_init::array_init(|_| ArrayVec::<(Vec3f, bool), SCREEN_WIDTH>::new()),
            timer: js_sys::Date::now(),
            time_scale: time_scale,
        };
        for i in 0..SCREEN_HEIGHT {
            for j in 0..SCREEN_WIDTH {
                inst.screen_out[i].push(0);
                inst.screen_data[i].push(0.0);
                inst.screen_rays[i].push((Vec3f::new((j as f32)*XRES - VIEW_WIDTH + cam_pos.x, (i as f32)*YRES - VIEW_HEIGHT + cam_pos.y, cam_pos.z), false));
            }
        }
        inst
    }
    pub fn kinetic_energy(&self) -> f32 {
        // Sum the kinetic energies of all component bodies
        let mut ke : f32 = 0.0;
        for i in 0..self.bodies.len() {
            ke += self.bodies[i].kinetic_energy();
        }
        ke
    }
    pub fn potential_energy(&self) -> f32 {
        let mut pe : f32 = 0.0;
        for i in 0..self.bodies.len() {
            for j in (i+1)..self.bodies.len() {
                pe += self.bodies[i].potential_energy(&self.bodies[j]);
            }
        }
        pe
    }
    fn write_screen(&mut self) {
        for i in 0..SCREEN_HEIGHT {
            for j in 0..SCREEN_WIDTH {
                self.screen_rays[i][j].1 = false;
                self.screen_rays[i][j].0 = Vec3f::new((j as f32)*XRES - VIEW_WIDTH - self.cam_pos.x, (i as f32)*YRES - VIEW_HEIGHT - self.cam_pos.y, 0.0 - self.cam_pos.z);
                match self.screen_data[i][j].floor() as u32 {
                    0..=20 => self.screen_out[i][j] = 32,
                    21..=40 => self.screen_out[i][j] = 45,
                    41..=80 => self.screen_out[i][j] = 43,
                    81..=120 => self.screen_out[i][j] = 118,
                    121..=160 => self.screen_out[i][j] = 88,
                    161..=200 => self.screen_out[i][j] = 056,
                    201..=240 => self.screen_out[i][j] = 87,
                    241..=255 => self.screen_out[i][j] = 064,
                    _ => self.screen_out[i][j] = 48,
                }
                self.screen_data[i][j] = 0.0;
            }
        }
    }
    pub fn update(&mut self) {
        let dt : f32 = (((js_sys::Date::now() - self.timer)/1000.0) * self.time_scale) as f32;
        self.timer = js_sys::Date::now();
        for i in 0..self.bodies.len() {
            for j in (i+1)..self.bodies.len() {
                let f : Vec3f = Body::gravity(&self.bodies[i], &self.bodies[j]);
                self.bodies[i].force(f);
                self.bodies[j].force(f.scalar_multiply(-1.0));
            }
            self.bodies[i].update(dt);
        }
        for i in 0..self.bodies.len() {
            for j in (i+1)..self.bodies.len() {
                if self.bodies[i].collide(&self.bodies[j]) { 
                    let impulse : Vec3f = self.bodies[i].bounce(&self.bodies[j]);

                    self.bodies[i].v = self.bodies[i].v.add(impulse.scalar_divide(self.bodies[i].m));
                    self.bodies[j].v = self.bodies[j].v.add(impulse.scalar_divide(-self.bodies[j].m));
                }
            }
        }
        // Update Camera Position
        if (self.camera_index < self.bodies.len()) {
          self.cam_pos = self.bodies[self.camera_index].x;
          self.cam_pos.x *= -1.0;
          self.cam_pos.y *= -1.0;
          self.cam_pos.z = 0.0;
        }else {
          println!("Camera Index out of range!");
        }

        for s in 0..STEPS {
            for i in 0..SCREEN_HEIGHT {
                for j in 0..SCREEN_WIDTH {
                    if self.screen_rays[i][j].1 {
                        continue;
                    }
                    let mut index : usize = 0;
                    let mut lowestDist : f32 = 100000.0;
                    for k in 0..self.bodies.len() {
                        let dist : f32 = self.bodies[k].dist(self.screen_rays[i][j].0);
                        if dist < lowestDist {
                            lowestDist = dist;
                            index = k;
                        }
                    }
                    let march : Vec3f = self.march_vec.scalar_multiply(self.bodies[index].dist(self.screen_rays[i][j].0));
                    if march.magnitude() < EPSILON {
                        self.screen_rays[i][j].1 = true;
                        let next : Vec3f = Vec3f {
                            x: self.screen_rays[i][j].0.x,
                            y: self.screen_rays[i][j].0.y,
                            z: self.screen_rays[i][j].0.z + EPSILON,
                        };
                        let norm : f32 = (self.bodies[index].dist(self.screen_rays[i][j].0)- self.bodies[index].dist(next))/EPSILON;
                        self.screen_data[i][j] = 255.0*norm;
                    }else {
                        self.screen_rays[i][j].0 = self.screen_rays[i][j].0.add(march);
                    }
                }
            }
        }
        self.write_screen();
    }
    pub fn screen_out(&self) -> String {
        let mut screen : String = Default::default();
        for i in 0..SCREEN_HEIGHT {
            screen += std::str::from_utf8(&self.screen_out[i]).unwrap();
            screen += "<br>";
        }
        screen
    }

    pub fn add_body(&mut self, body: Body) {
        self.bodies.push(body);
    }
}
