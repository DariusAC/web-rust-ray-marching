
let wasm;

let cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });

cachedTextDecoder.decode();

let cachegetUint8Memory0 = null;
function getUint8Memory0() {
    if (cachegetUint8Memory0 === null || cachegetUint8Memory0.buffer !== wasm.memory.buffer) {
        cachegetUint8Memory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachegetUint8Memory0;
}

function getStringFromWasm0(ptr, len) {
    return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}

function _assertClass(instance, klass) {
    if (!(instance instanceof klass)) {
        throw new Error(`expected instance of ${klass.name}`);
    }
    return instance.ptr;
}

let cachegetInt32Memory0 = null;
function getInt32Memory0() {
    if (cachegetInt32Memory0 === null || cachegetInt32Memory0.buffer !== wasm.memory.buffer) {
        cachegetInt32Memory0 = new Int32Array(wasm.memory.buffer);
    }
    return cachegetInt32Memory0;
}
/**
*/
export class Body {

    static __wrap(ptr) {
        const obj = Object.create(Body.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_body_free(ptr);
    }
    /**
    */
    get r() {
        var ret = wasm.__wbg_get_body_r(this.ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set r(arg0) {
        wasm.__wbg_set_body_r(this.ptr, arg0);
    }
    /**
    */
    get m() {
        var ret = wasm.__wbg_get_body_m(this.ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set m(arg0) {
        wasm.__wbg_set_body_m(this.ptr, arg0);
    }
    /**
    */
    get x() {
        var ret = wasm.__wbg_get_body_x(this.ptr);
        return Vec3f.__wrap(ret);
    }
    /**
    * @param {Vec3f} arg0
    */
    set x(arg0) {
        _assertClass(arg0, Vec3f);
        var ptr0 = arg0.ptr;
        arg0.ptr = 0;
        wasm.__wbg_set_body_x(this.ptr, ptr0);
    }
    /**
    */
    get v() {
        var ret = wasm.__wbg_get_body_v(this.ptr);
        return Vec3f.__wrap(ret);
    }
    /**
    * @param {Vec3f} arg0
    */
    set v(arg0) {
        _assertClass(arg0, Vec3f);
        var ptr0 = arg0.ptr;
        arg0.ptr = 0;
        wasm.__wbg_set_body_v(this.ptr, ptr0);
    }
    /**
    */
    get a() {
        var ret = wasm.__wbg_get_body_a(this.ptr);
        return Vec3f.__wrap(ret);
    }
    /**
    * @param {Vec3f} arg0
    */
    set a(arg0) {
        _assertClass(arg0, Vec3f);
        var ptr0 = arg0.ptr;
        arg0.ptr = 0;
        wasm.__wbg_set_body_a(this.ptr, ptr0);
    }
    /**
    * @param {Vec3f} pos
    * @param {Vec3f} vel
    * @param {number} rad
    * @param {number} mass
    * @returns {Body}
    */
    static new(pos, vel, rad, mass) {
        _assertClass(pos, Vec3f);
        var ptr0 = pos.ptr;
        pos.ptr = 0;
        _assertClass(vel, Vec3f);
        var ptr1 = vel.ptr;
        vel.ptr = 0;
        var ret = wasm.body_new(ptr0, ptr1, rad, mass);
        return Body.__wrap(ret);
    }
    /**
    * @returns {number}
    */
    kinetic_energy() {
        var ret = wasm.body_kinetic_energy(this.ptr);
        return ret;
    }
    /**
    * @param {Body} b
    * @returns {number}
    */
    potential_energy(b) {
        _assertClass(b, Body);
        var ret = wasm.body_potential_energy(this.ptr, b.ptr);
        return ret;
    }
    /**
    * @param {Body} b1
    * @param {Body} b2
    * @returns {Vec3f}
    */
    static gravity(b1, b2) {
        _assertClass(b1, Body);
        _assertClass(b2, Body);
        var ret = wasm.body_gravity(b1.ptr, b2.ptr);
        return Vec3f.__wrap(ret);
    }
    /**
    * @param {Body} b1
    * @returns {boolean}
    */
    collide(b1) {
        _assertClass(b1, Body);
        var ret = wasm.body_collide(this.ptr, b1.ptr);
        return ret !== 0;
    }
    /**
    * @param {Body} b1
    * @returns {Body}
    */
    merge(b1) {
        _assertClass(b1, Body);
        var ret = wasm.body_merge(this.ptr, b1.ptr);
        return Body.__wrap(ret);
    }
    /**
    * @param {Body} b1
    * @returns {Vec3f}
    */
    bounce(b1) {
        _assertClass(b1, Body);
        var ret = wasm.body_bounce(this.ptr, b1.ptr);
        return Vec3f.__wrap(ret);
    }
    /**
    * @param {Vec3f} target
    * @returns {number}
    */
    dist(target) {
        _assertClass(target, Vec3f);
        var ptr0 = target.ptr;
        target.ptr = 0;
        var ret = wasm.body_dist(this.ptr, ptr0);
        return ret;
    }
    /**
    * @returns {Body}
    */
    static default() {
        var ret = wasm.body_default();
        return Body.__wrap(ret);
    }
    /**
    * @param {number} dt
    */
    update(dt) {
        wasm.body_update(this.ptr, dt);
    }
    /**
    * @param {Vec3f} f
    */
    force(f) {
        _assertClass(f, Vec3f);
        var ptr0 = f.ptr;
        f.ptr = 0;
        wasm.body_force(this.ptr, ptr0);
    }
}
/**
*/
export class Instance {

    static __wrap(ptr) {
        const obj = Object.create(Instance.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_instance_free(ptr);
    }
    /**
    * @param {Vec3f} cam_pos
    * @param {Vec3f} march_vec
    * @param {number} wipe_height
    * @param {number} time_scale
    * @returns {Instance}
    */
    static new(cam_pos, march_vec, wipe_height, time_scale) {
        _assertClass(cam_pos, Vec3f);
        var ptr0 = cam_pos.ptr;
        cam_pos.ptr = 0;
        _assertClass(march_vec, Vec3f);
        var ptr1 = march_vec.ptr;
        march_vec.ptr = 0;
        var ret = wasm.instance_new(ptr0, ptr1, wipe_height, time_scale);
        return Instance.__wrap(ret);
    }
    /**
    * @returns {number}
    */
    kinetic_energy() {
        var ret = wasm.instance_kinetic_energy(this.ptr);
        return ret;
    }
    /**
    * @returns {number}
    */
    potential_energy() {
        var ret = wasm.instance_potential_energy(this.ptr);
        return ret;
    }
    /**
    */
    update() {
        wasm.instance_update(this.ptr);
    }
    /**
    * @returns {string}
    */
    screen_out() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.instance_screen_out(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }
    /**
    * @param {Body} body
    */
    add_body(body) {
        _assertClass(body, Body);
        var ptr0 = body.ptr;
        body.ptr = 0;
        wasm.instance_add_body(this.ptr, ptr0);
    }
}
/**
*/
export class Vec3f {

    static __wrap(ptr) {
        const obj = Object.create(Vec3f.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_vec3f_free(ptr);
    }
    /**
    */
    get x() {
        var ret = wasm.__wbg_get_vec3f_x(this.ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set x(arg0) {
        wasm.__wbg_set_vec3f_x(this.ptr, arg0);
    }
    /**
    */
    get y() {
        var ret = wasm.__wbg_get_vec3f_y(this.ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set y(arg0) {
        wasm.__wbg_set_vec3f_y(this.ptr, arg0);
    }
    /**
    */
    get z() {
        var ret = wasm.__wbg_get_vec3f_z(this.ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set z(arg0) {
        wasm.__wbg_set_vec3f_z(this.ptr, arg0);
    }
    /**
    * @returns {Vec3f}
    */
    static default() {
        var ret = wasm.vec3f_default();
        return Vec3f.__wrap(ret);
    }
    /**
    * @param {number} x
    * @param {number} y
    * @param {number} z
    * @returns {Vec3f}
    */
    static new(x, y, z) {
        var ret = wasm.vec3f_new(x, y, z);
        return Vec3f.__wrap(ret);
    }
    /**
    * @returns {number}
    */
    magnitude() {
        var ret = wasm.vec3f_magnitude(this.ptr);
        return ret;
    }
    /**
    * @param {Vec3f} target
    * @returns {number}
    */
    dist(target) {
        _assertClass(target, Vec3f);
        var ptr0 = target.ptr;
        target.ptr = 0;
        var ret = wasm.vec3f_dist(this.ptr, ptr0);
        return ret;
    }
    /**
    * @returns {Vec3f}
    */
    normalize() {
        var ret = wasm.vec3f_normalize(this.ptr);
        return Vec3f.__wrap(ret);
    }
    /**
    * @param {number} c
    * @returns {Vec3f}
    */
    scalar_multiply(c) {
        var ret = wasm.vec3f_scalar_multiply(this.ptr, c);
        return Vec3f.__wrap(ret);
    }
    /**
    * @param {number} c
    * @returns {Vec3f}
    */
    scalar_divide(c) {
        var ret = wasm.vec3f_scalar_divide(this.ptr, c);
        return Vec3f.__wrap(ret);
    }
    /**
    * @param {Vec3f} other
    * @returns {Vec3f}
    */
    add(other) {
        _assertClass(other, Vec3f);
        var ptr0 = other.ptr;
        other.ptr = 0;
        var ret = wasm.vec3f_add(this.ptr, ptr0);
        return Vec3f.__wrap(ret);
    }
    /**
    * @param {Vec3f} other
    * @returns {Vec3f}
    */
    sub(other) {
        _assertClass(other, Vec3f);
        var ptr0 = other.ptr;
        other.ptr = 0;
        var ret = wasm.vec3f_sub(this.ptr, ptr0);
        return Vec3f.__wrap(ret);
    }
}

async function load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {
        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);

            } catch (e) {
                if (module.headers.get('Content-Type') != 'application/wasm') {
                    console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                } else {
                    throw e;
                }
            }
        }

        const bytes = await module.arrayBuffer();
        return await WebAssembly.instantiate(bytes, imports);

    } else {
        const instance = await WebAssembly.instantiate(module, imports);

        if (instance instanceof WebAssembly.Instance) {
            return { instance, module };

        } else {
            return instance;
        }
    }
}

async function init(input) {
    if (typeof input === 'undefined') {
        input = new URL('web_rust_ray_marching_bg.wasm', import.meta.url);
    }
    const imports = {};
    imports.wbg = {};
    imports.wbg.__wbg_now_e6c39c10a5e8aec7 = function() {
        var ret = Date.now();
        return ret;
    };
    imports.wbg.__wbindgen_throw = function(arg0, arg1) {
        throw new Error(getStringFromWasm0(arg0, arg1));
    };

    if (typeof input === 'string' || (typeof Request === 'function' && input instanceof Request) || (typeof URL === 'function' && input instanceof URL)) {
        input = fetch(input);
    }



    const { instance, module } = await load(await input, imports);

    wasm = instance.exports;
    init.__wbindgen_wasm_module = module;

    return wasm;
}

export default init;

