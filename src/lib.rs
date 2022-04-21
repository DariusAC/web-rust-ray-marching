pub mod utils;
pub mod vec3;
pub mod physics;
pub mod config;

use vec3::vec3f::Vec3f;
use config::constants::*;
use physics::rigidbody::Body;
use physics::instance::Instance;

use wasm_bindgen::prelude::*;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

