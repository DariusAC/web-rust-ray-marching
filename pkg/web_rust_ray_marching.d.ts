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
* @returns {Body}
*/
  static default(): Body;
/**
* @param {number} dt
*/
  update(dt: number): void;
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
* @param {number} x
* @param {number} y
* @param {number} z
* @returns {Vec3f}
*/
  static new(x: number, y: number, z: number): Vec3f;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_vec3f_free: (a: number) => void;
  readonly vec3f_new: (a: number, b: number, c: number) => number;
  readonly __wbg_body_free: (a: number) => void;
  readonly body_new: (a: number, b: number, c: number, d: number) => number;
  readonly body_default: () => number;
  readonly body_update: (a: number, b: number) => void;
  readonly __wbg_instance_free: (a: number) => void;
  readonly instance_new: (a: number, b: number, c: number, d: number) => number;
  readonly instance_update: (a: number) => void;
  readonly instance_screen_out: (a: number, b: number) => void;
  readonly instance_add_body: (a: number, b: number) => void;
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
