use wasm_bindgen::prelude::*;
use crate::vec3::vec3f::Vec3f;
use crate::config::constants::*;

#[derive(Copy, Clone)]
#[wasm_bindgen]
pub struct Body {
  pub r: f32,
  pub m: f32,
  pub x: Vec3f,
  pub v: Vec3f,
  pub a: Vec3f,
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
  pub fn kinetic_energy(&self) -> f32 {
      return 0.5*self.v.magnitude().powf(2.0) * self.m;
  }
  pub fn potential_energy(&self, b: &Body) -> f32 {
      return -G*self.m*b.m/(self.x.sub(b.x)).magnitude();
  }
  pub fn gravity(b1 : &Body, b2: &Body) -> Vec3f {
    // returns force b1 would feel
    // to get force for b2 multiply by -1
    let dist : Vec3f = b2.x.sub(b1.x);
    dist.normalize().scalar_multiply(G*b1.m*b2.m/(dist.magnitude()*dist.magnitude()))
  }
  pub fn collide(&self, b1: &Body) -> bool {
    return self.x.sub(b1.x).magnitude() < (self.r + b1.r);
  }
  pub fn merge(&self, b1: &Body) -> Body {
    Body::new(
        self.x.add(b1.x).scalar_multiply(0.5),
        self.v.scalar_multiply(self.m).add(b1.v.scalar_multiply(b1.m)).scalar_divide(self.m+b1.m),
        (self.r.powf(2.0) + b1.r.powf(2.0)).sqrt(),
        self.m + b1.m
    )
  }
  // returns impulse of the collision which is then applied to both objects
  pub fn bounce(&self, b1: &Body) -> Vec3f {
      let n : Vec3f = b1.x.sub(self.x).normalize();

      let a : f32 = -2.0*(n.x*(self.v.x - b1.v.x) + n.y*(self.v.y - b1.v.y) + n.z*(self.v.z - b1.v.z))/(n.magnitude().powf(2.0)*(1.0/self.m + 1.0/b1.m));
      
      return n.scalar_multiply(a);
  }
  pub fn dist(&self, target: Vec3f) -> f32 {
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
  pub fn force(&mut self, f : Vec3f) {
    self.a = self.a.add(f.scalar_divide(self.m));
  }
}
