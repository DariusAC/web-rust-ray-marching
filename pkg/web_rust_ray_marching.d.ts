/* tslint:disable */
/* eslint-disable */
/**
*/
export class Body {
  free(): void;
/**
* @param {Vec3f} pos
* @param {Vec3f} vel
* @param {number} rad
* @param {number} mass
* @returns {Body}
*/
  static new(pos: Vec3f, vel: Vec3f, rad: number, mass: number): Body;
/**
* @returns {number}
*/
  kinetic_energy(): number;
/**
* @param {Body} b
* @returns {number}
*/
  potential_energy(b: Body): number;
/**
* @param {Body} b1
* @param {Body} b2
* @returns {Vec3f}
*/
  static gravity(b1: Body, b2: Body): Vec3f;
/**
* @param {Body} b1
* @returns {boolean}
*/
  collide(b1: Body): boolean;
/**
* @param {Body} b1
* @returns {Body}
*/
  merge(b1: Body): Body;
/**
* @param {Body} b1
* @returns {Vec3f}
*/
  bounce(b1: Body): Vec3f;
/**
* @param {Vec3f} target
* @returns {number}
*/
  dist(target: Vec3f): number;
/**
* @returns {Body}
*/
  static default(): Body;
/**
* @param {number} dt
*/
  update(dt: number): void;
/**
* @param {Vec3f} f
*/
  force(f: Vec3f): void;
/**
*/
  a: Vec3f;
/**
*/
  m: number;
/**
*/
  r: number;
/**
*/
  v: Vec3f;
/**
*/
  x: Vec3f;
}
/**
*/
export class Instance {
  free(): void;
/**
* @param {Vec3f} cam_pos
* @param {Vec3f} march_vec
* @param {number} wipe_height
* @param {number} time_scale
* @returns {Instance}
*/
  static new(cam_pos: Vec3f, march_vec: Vec3f, wipe_height: number, time_scale: number): Instance;
/**
* @returns {number}
*/
  kinetic_energy(): number;
/**
* @returns {number}
*/
  potential_energy(): number;
/**
*/
  update(): void;
/**
* @returns {string}
*/
  screen_out(): string;
/**
* @param {Body} body
*/
  add_body(body: Body): void;
}
/**
*/
export class Vec3f {
  free(): void;
/**
* @returns {Vec3f}
*/
  static default(): Vec3f;
/**
* @param {number} x
* @param {number} y
* @param {number} z
* @returns {Vec3f}
*/
  static new(x: number, y: number, z: number): Vec3f;
/**
* @returns {number}
*/
  magnitude(): number;
/**
* @param {Vec3f} target
* @returns {number}
*/
  dist(target: Vec3f): number;
/**
* @returns {Vec3f}
*/
  normalize(): Vec3f;
/**
* @param {number} c
* @returns {Vec3f}
*/
  scalar_multiply(c: number): Vec3f;
/**
* @param {number} c
* @returns {Vec3f}
*/
  scalar_divide(c: number): Vec3f;
/**
* @param {Vec3f} other
* @returns {Vec3f}
*/
  add(other: Vec3f): Vec3f;
/**
* @param {Vec3f} other
* @returns {Vec3f}
*/
  sub(other: Vec3f): Vec3f;
/**
*/
  x: number;
/**
*/
  y: number;
/**
*/
  z: number;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_body_free: (a: number) => void;
  readonly __wbg_get_body_r: (a: number) => number;
  readonly __wbg_set_body_r: (a: number, b: number) => void;
  readonly __wbg_get_body_m: (a: number) => number;
  readonly __wbg_set_body_m: (a: number, b: number) => void;
  readonly __wbg_get_body_x: (a: number) => number;
  readonly __wbg_set_body_x: (a: number, b: number) => void;
  readonly __wbg_get_body_v: (a: number) => number;
  readonly __wbg_set_body_v: (a: number, b: number) => void;
  readonly __wbg_get_body_a: (a: number) => number;
  readonly __wbg_set_body_a: (a: number, b: number) => void;
  readonly body_new: (a: number, b: number, c: number, d: number) => number;
  readonly body_kinetic_energy: (a: number) => number;
  readonly body_potential_energy: (a: number, b: number) => number;
  readonly body_gravity: (a: number, b: number) => number;
  readonly body_collide: (a: number, b: number) => number;
  readonly body_merge: (a: number, b: number) => number;
  readonly body_bounce: (a: number, b: number) => number;
  readonly body_dist: (a: number, b: number) => number;
  readonly body_default: () => number;
  readonly body_update: (a: number, b: number) => void;
  readonly body_force: (a: number, b: number) => void;
  readonly __wbg_instance_free: (a: number) => void;
  readonly instance_new: (a: number, b: number, c: number, d: number) => number;
  readonly instance_kinetic_energy: (a: number) => number;
  readonly instance_potential_energy: (a: number) => number;
  readonly instance_update: (a: number) => void;
  readonly instance_screen_out: (a: number, b: number) => void;
  readonly instance_add_body: (a: number, b: number) => void;
  readonly __wbg_vec3f_free: (a: number) => void;
  readonly __wbg_get_vec3f_x: (a: number) => number;
  readonly __wbg_set_vec3f_x: (a: number, b: number) => void;
  readonly __wbg_get_vec3f_y: (a: number) => number;
  readonly __wbg_set_vec3f_y: (a: number, b: number) => void;
  readonly __wbg_get_vec3f_z: (a: number) => number;
  readonly __wbg_set_vec3f_z: (a: number, b: number) => void;
  readonly vec3f_default: () => number;
  readonly vec3f_new: (a: number, b: number, c: number) => number;
  readonly vec3f_magnitude: (a: number) => number;
  readonly vec3f_dist: (a: number, b: number) => number;
  readonly vec3f_normalize: (a: number) => number;
  readonly vec3f_scalar_multiply: (a: number, b: number) => number;
  readonly vec3f_scalar_divide: (a: number, b: number) => number;
  readonly vec3f_add: (a: number, b: number) => number;
  readonly vec3f_sub: (a: number, b: number) => number;
  readonly __wbindgen_add_to_stack_pointer: (a: number) => number;
  readonly __wbindgen_free: (a: number, b: number) => void;
}

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {InitInput | Promise<InitInput>} module_or_path
*
* @returns {Promise<InitOutput>}
*/
export default function init (module_or_path?: InitInput | Promise<InitInput>): Promise<InitOutput>;
