
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
    * @param {number} x
    * @param {number} y
    * @param {number} z
    * @returns {Vec3f}
    */
    static new(x, y, z) {
        var ret = wasm.vec3f_new(x, y, z);
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

