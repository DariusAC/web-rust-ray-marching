use wasm_bindgen::prelude::*;

#[wasm_bindgen]
#[derive(Copy, Clone)]
pub struct Vec3f {
  pub x: f32,
  pub y: f32,
  pub z: f32,
}
#[wasm_bindgen]
impl Vec3f {
  pub fn default() -> Vec3f {
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
  pub fn magnitude(&self) -> f32 {
    ((self.x)*(self.x) + (self.y)*(self.y) + (self.z)*(self.z)).sqrt()
  }
  pub fn dist(&self, target: Vec3f) -> f32 {
    Vec3f {
      x: target.x - self.x,
      y: target.y - self.y,
      z: target.z - self.z,
    }.magnitude()
  }
  pub fn normalize(&self) -> Vec3f {
    let mag = self.magnitude();
    Vec3f {
      x:self.x/mag,
      y:self.y/mag,
      z:self.z/mag,
    }
  }
  pub fn scalar_multiply(&self, c: f32) -> Vec3f {
    Vec3f {
      x: self.x * c,
      y: self.y * c,
      z: self.z * c,
    }
  }
  pub fn scalar_divide(&self, c: f32) -> Vec3f {
    Vec3f {
      x: self.x / c,
      y: self.y / c,
      z: self.z / c,
    }
  }
  pub fn add(&self, other: Vec3f) -> Vec3f {
    Vec3f {
      x: self.x + other.x,
      y: self.y + other.y,
      z: self.z + other.z,
    }
  }
  pub fn sub(&self, other: Vec3f) -> Vec3f {
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
