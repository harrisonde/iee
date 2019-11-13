/**!
 * @cidekar/iframe-event-emitter version 1.0.0
 * (c) 2014-2019 Cidekar
 * @license Released under the Apache-2.0 license.
 */
const CONFIGS = {
  component: undefined,
  dispatcherOrigin: '*',
  receiverOrigin: '*',
  silent: 'web-js' === 'web-min-js'
};
var store = {};
function get(config) {
  return store[config];
}
function set(options) {
  store = Object.assign(CONFIGS, options);
}

function log(message) {
    if (!get('silent')) {
        console.warn(new Date(), '\n', message);
    }
}

const HOOKS = ['created', 'mounted'];
const STORE = [];
function bind() {
    let callback = function (arg) {
        if (typeof arg === 'function') {
            arg.apply(this, [arg]);
        }
    };
    HOOKS.forEach(function (hook) {
        try {
            register(hook, callback, true);
        } catch (e) {
            log(e);
        }
    });
}
function call(name, args) {
    if (typeof STORE[name] != 'undefined') {
        STORE[name].callback.apply(this, [args]);
    }
}
function register(name, callback, lifecycle) {
    try {
        if (!callback) {
            throw new Error('attempt to register ' + name + ' hook without callback');
        }
        if (typeof STORE[name] === 'undefined') {
            STORE[name] = {
                callback: callback
            };
            if (lifecycle) {
                STORE[name].lifecycle = 'register';
            }
        } else {
            throw new Error('attempt to re-register ' + name);
        }
    } catch (e) {
        log(e);
    }
}
function list$1(name) {
    return name ? STORE[name] : STORE;
}
function boot() {
    bind();
    created();
    mounted();
}
function created() {
    let HOOK = 'created';
    call(HOOK, function () {
        STORE[HOOK].lifecycle = true;
    });
}
function mounted() {
    let HOOK = 'mounted';
    call(HOOK, function () {
        STORE[HOOK].lifecycle = true;
    });
}

function boot$1() {
    let callback = function (arg) {
        if (typeof arg === 'function') {
            arg.apply(this, [arg]);
        }
    };
    register('dispatched', callback);
}
const TARGET = window.parent;
function message(payload) {
    try {
        if (!payload) {
            throw new Error('attempt to dispatch without payload');
        } else if (!payload.event) {
            throw new Error('attempt to dispatch without defining an event');
        }
        TARGET.postMessage(payload, get('receiverOrigin'));
    } catch (e) {
        log(e);
    }
}

const TYPES = [{
    type: 'message',
    listener: handler
}, {
    type: 'build',
    listener: on
}];
const TARGET$1 = window;
function boot$2() {
    let callback = function (arg) {
        if (typeof arg === 'function') {
            arg.apply(this, [arg]);
        }
    };
    register('received', callback);
    register$1();
}
function register$1() {
    TYPES.forEach(function (type) {
        try {
            on(type.type, type.listener);
        } catch (e) {
            log(e);
        }
    });
}
function on(type, callback) {
    try {
        TARGET$1.addEventListener(type, callback);
    } catch (e) {
        log(e);
    }
}
const SUPPORTED_MESSAGES_TYPE = ['string', 'object'];
function handler(event) {
    if (!trused(event.origin)) {
        return;
    }
    if (event.data) {
        try {
            if (isSupported(event) && list$1('created').lifecycle === true && list$1('mounted').lifecycle === true) {
                log(event);
                emit(event.data.event, event.data);
            }
        } catch (e) {
            log(e);
        }
    }
    function isSupported(MessageEvent) {
        var eventType = typeof MessageEvent.data;
        for (var i = 0; i < SUPPORTED_MESSAGES_TYPE.length; i++) {
            if (SUPPORTED_MESSAGES_TYPE[i] === eventType) {
                return true;
            }
        }
        return false;
    }
}
function trused(origin) {
    let originWhitelist = get('dispatcherOrigin');
    if (typeof originWhitelist === 'string' && originWhitelist === '*') {
        return true;
    }
    if (typeof originWhitelist === 'object') {
        for (var i = 0; i < originWhitelist.length; i++) {
            if (originWhitelist[i] === origin) {
                return true;
            }
        }
    }
    log('received untrused message from ' + origin);
    return false;
}
function emit(type, message) {
    try {
        var eventToEmit = new Event(type);
        Object.assign(eventToEmit, message);
        TARGET$1.dispatchEvent(eventToEmit);
    } catch (e) {
        log(e);
    }
}

function boot$3() {
    set(this);
    boot();
    boot$1();
    boot$2();
}

function Iee(options) {
    boot$3.apply(options);
    if (options.component === 'dispatcher') {
        this.message = message;
    } else if (options.component === 'receiver') {
        this.on = on;
    } else {
        log('did you register a component?');
    }
}

Iee.version = '1.0.0';

export default Iee;
