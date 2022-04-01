mod utils;

use wasm_bindgen::prelude::*;
use term_size;
use array_init::array_init;
use arrayvec::ArrayVec;
use js_sys::Date;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

const SCREEN_WIDTH : usize = 128;
const SCREEN_HEIGHT : usize = 64;

const VIEW_WIDTH : f32 = 4.0;
const VIEW_HEIGHT : f32 = 4.0;

const G : f32 = 0.00018;

const EPSILON : f32 = 0.10;
const STEPS : u8 = 3;

const XRES : f32 = 2.0*VIEW_WIDTH/((SCREEN_WIDTH-1) as f32);
const YRES : f32 = 2.0*VIEW_HEIGHT/((SCREEN_HEIGHT-1) as f32);

#[wasm_bindgen]
#[derive(Copy, Clone)]
pub struct Vec3f {
  x: f32,
  y: f32,
  z: f32,
}
#[wasm_bindgen]
impl Vec3f {
  fn default() -> Vec3f {
    Vec3f {
      x: 0.0,
      y: 0.0,
      z: 0.0,
    }
  } 
  pub fn new(x: f32, y:f32, z:f32) -> Vec3f {
    Vec3f {
      x,
      y,
      z,
    }
  }
  fn magnitude(&self) -> f32 {
    ((self.x)*(self.x) + (self.y)*(self.y) + (self.z)*(self.z)).sqrt()
  }
  fn dist(&self, target: Vec3f) -> f32 {
    Vec3f {
      x: target.x - self.x,
      y: target.y - self.y,
      z: target.z - self.z,
    }.magnitude()
  }
  fn normalize(&self) -> Vec3f {
    let mag = self.magnitude();
    Vec3f {
      x:self.x/mag,
      y:self.y/mag,
      z:self.z/mag,
    }
  }
  fn scalar_multiply(&self, c: f32) -> Vec3f {
    Vec3f {
      x: self.x * c,
      y: self.y * c,
      z: self.z * c,
    }
  }
  fn scalar_divide(&self, c: f32) -> Vec3f {
    Vec3f {
      x: self.x / c,
      y: self.y / c,
      z: self.z / c,
    }
  }
  fn add(&self, other: Vec3f) -> Vec3f {
    Vec3f {
      x: self.x + other.x,
      y: self.y + other.y,
      z: self.z + other.z,
    }
  }
  fn sub(&self, other: Vec3f) -> Vec3f {
    Vec3f {
      x: self.x - other.x,
      y: self.y - other.y,
      z: self.z - other.z,
    }
  }
}
impl Default for Vec3f {
    #[inline]
    fn default() -> Vec3f {
        Vec3f {
          x: 0.0,
          y: 0.0,
          z: 0.0,
        }
    }
}

#[derive(Copy, Clone)]
#[wasm_bindgen]
pub struct Body {
  r: f32,
  m: f32,
  x: Vec3f,
  v: Vec3f,
  a: Vec3f,
}
#[wasm_bindgen]
impl Body {
  pub fn new(pos: Vec3f, vel: Vec3f, rad: f32, mass: f32) -> Body {
    Body {
      x: pos,
      v: vel,
      r: rad,
      m: mass,
      a: Vec3f::new(0.0, 0.0, 0.0),
    }
  }
  /*fn collision(b1 : &Body, b2 : &Body) -> Vec3f {
    if (b1.x.dist(b2.x) >= b1.r + b2.r) {
      Vec3f {
        x: 0.0,
        y: 0.0,
        z: 0.0,
      }
    }
    Vec3f {

    }
  }*/
  fn gravity(b1 : &Body, b2: &Body) -> Vec3f {
    // returns force b1 would feel
    // to get force for b2 multiply by -1
    let dist : Vec3f = b2.x.sub(b1.x);
    dist.normalize().scalar_multiply(G*b1.m*b2.m/(dist.magnitude()*dist.magnitude()))
  }
  fn dist(&self, target: Vec3f) -> f32 {
    Vec3f {
      x: self.x.x - target.x,
      y: self.x.y - target.y,
      z: self.x.z - target.z,
    }.magnitude() - self.r
  }
  pub fn default() -> Body {
    Body {
      r: 0.0,
      m: 0.0,
      x: Vec3f {
        x: 0.0,
        y: 0.0,
        z: 0.0,
      },
      v: Vec3f {
        x: 0.0,
        y: 0.0,
        z: 0.0,
      },
      a: Vec3f {
        x: 0.0,
        y: 0.0,
        z: 0.0,
      },
    }
  }
  pub fn update(&mut self, dt : f32) {
    self.v = self.v.add(self.a.scalar_multiply(dt));
    self.x = self.x.add(self.v.scalar_multiply(dt));
    self.a = Vec3f::default();
  }
  fn force(&mut self, f : Vec3f) {
    self.a = self.a.add(f.scalar_divide(self.m));
  }
}
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
/*fn main() {
  let mut console_width = 0;
  let mut console_height = 0;
  if let Some((c_width, c_height)) = term_size::dimensions() {
   console_width = c_width;
   console_height = c_height;
  }else {
    println!("Unable to get term size :(");
    return;
  }

  let wipe : String = "\n".repeat(console_height);

  let mut inst : Instance = Instance::new(
    Vec3f {
      x: 1.0,
      y: 0.0,
      z: 0.0,
    },
    Vec3f {
      x: 0.0,
      y: 0.0,
      z: 1.0,
    },
    console_height,
    3.0,
  );

  inst.add_body(
    Body {
      r: 0.3,
      m: 4500.0,
      x: Vec3f {
        x: 0.0,
        y: 0.0,
        z: 5.0,
      },
      v: Vec3f {
        x: 0.0,
        y: 0.0,
        z: 0.0,
      },
      a: Vec3f {
        x: 0.0,
        y: 0.0,
        z: 0.0,
      },
    }
  );
  inst.add_body(
    Body {
      r: 0.1,
      m: 15.0,
      x: Vec3f {
        x: 0.0,
        y: 1.3,
        z: 5.0,
      },
      v: Vec3f {
        x: 0.9115,
        y: 0.0,
        z: 0.0,
      },
      a: Vec3f {
        x: 0.0,
        y: 0.0,
        z: 0.0,
      },
    }
  );
  inst.add_body(
    Body {
      r: 0.2,
      m: 30.0,
      x: Vec3f {
        x: 0.0,
        y: -1.3,
        z: 5.0,
      },
      v: Vec3f {
        x: -0.9115,
        y: 0.0,
        z: 0.0,
      },
      a: Vec3f {
        x: 0.0,
        y: 0.0,
        z: 0.0,
      },
    }
  );


  while(true) {
    inst.update();
    // Print output
    let mut screen : String = Default::default();
    for i in 0..SCREEN_HEIGHT {
        screen += std::str::from_utf8(&inst.screen_out[i]).unwrap();
        screen += "\n";
    }
    println!("{}", screen);
  } 
}
*/
