/**!
 * @cidekar/window-rivet version 1.0.0
 * Copyright 2019 Cidekar, LLC
 * @license Released under the Apache-2.0 license.
 */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global.rivet = factory());
}(this, (function () { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */
    /* global Reflect, Promise */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    var Configuration = /** @class */function () {
        function Configuration() {
            this.configuration = {
                component: undefined,
                dispatcherOrigin: '*',
                receiverOrigin: '*',
                silent: false,
                warningOrigin: true
            };
            this.setConfiguration = function (configurationOptions) {
                try {
                    Configuration.store.cache = Object.assign(Configuration.store.cache, configurationOptions);
                    return true;
                } catch (error) {
                    return error;
                }
            };
            Configuration.store.cache = this.configuration;
        }
        Configuration.store = {
            cache: {},
            hooks: {}
        };
        Configuration.getConfiguration = function (configurationKey) {
            if (configurationKey) return Configuration.store.cache[configurationKey];
            return {};
        };
        Configuration.listConfiguration = function (vaultKey) {
            if (vaultKey === void 0) {
                vaultKey = 'cache';
            }
            return Configuration.store[vaultKey];
        };
        Configuration.putConfiguration = function (vault, configuration) {
            if (vault === void 0) {
                vault = 'cache';
            }
            Object.assign(Configuration.store[vault], configuration);
        };
        return Configuration;
    }();

    /*eslint no-console: ["error", { allow: ["warn"] }] */
    /**
     * Log a message to the console.
     * @param {String} message A message to display in the console
     * @return null
     */
    function log(message) {
        if (!Configuration.getConfiguration('silent')) {
            console.warn(message);
        }
    }

    var SystemHooks = /** @class */function () {
        function SystemHooks() {}
        SystemHooks.bind = function () {
            var callback = function (arg) {
            };
            var hooks = ['created', 'mounted'];
            hooks.forEach(function (hook) {
                try {
                    SystemHooks.register(hook, callback);
                } catch (e) {
                    log(e);
                }
            });
        };
        /**
         * Start system, prepare to enter, record, and processed the configuration.
         */
        SystemHooks.boot = function () {
            SystemHooks.bind();
            SystemHooks.call('created');
        };
        /**
         * Fire and update a hook related event bound into the system store.
         */
        SystemHooks.call = function (name, args) {
            var hook = Configuration.listConfiguration('hooks')[name];
            if (typeof hook != 'undefined') {
                if (hook.callback) {
                    hook.callback.apply(SystemHooks, [args]);
                }
                hook.lifecycle = true;
                hook.lineage = hook.lineage.concat(['ready']);
            }
        };
        /**
         * Enter and record a hook related event into the system store.
         */
        SystemHooks.register = function (name, callback, lifecycle) {
            var _a;
            if (callback === void 0) {
                callback = null;
            }
            if (lifecycle === void 0) {
                lifecycle = 'register';
            }
            try {
                var hook = Configuration.listConfiguration('hooks')[name];
                if (typeof hook === 'undefined') {
                    var hook_1 = (_a = {}, _a[name] = {
                        lifecycle: lifecycle,
                        callback: callback,
                        lineage: [lifecycle]
                    }, _a);
                    Configuration.putConfiguration('hooks', hook_1);
                } else if (typeof hook != 'undefined') {
                    hook.callback = callback, hook.lifecycle = lifecycle;
                    hook.lineage = hook.lineage.concat([lifecycle]);
                }
            } catch (e) {
                log(e);
            }
        };
        /**
         * Helper method to confirm the system is ready to handle communication.
         */
        SystemHooks.ready = function () {
            var isReady = false;
            var systemHooks = Configuration.listConfiguration('hooks');
            if (!systemHooks) return isReady;
            if (systemHooks['created'].lifecycle && systemHooks['mounted'].lifecycle) {
                isReady = true;
            }
            return isReady;
        };
        return SystemHooks;
    }();

    // Extend Component base with sub components 
    // this will provide fallback methods.
    var ComponentBase = /** @class */function () {
        function ComponentBase(componentType) {
            var _this = this;
            this.supported_message_types = ['string', 'object'];
            this.target = null;
            this.targetOrigin = null;
            this.warningOrigin = null;
            this.componentType = null;
            this.bind = function () {
                _this.listen('message', _this.handler);
            };
            this.listen = function (eventType, callback) {
                try {
                    window.addEventListener(eventType, callback);
                } catch (e) {
                    log(e);
                }
            };
            this.handler = function (event) {
                // Validate origin 
                if (!_this.trusted(event.origin)) {
                    return;
                }
                // Validate
                if (event.data) {
                    try {
                        if (_this.isSupported(event) && SystemHooks.ready()) {
                            if (_this.targetOrigin === '*' && _this.warningOrigin) {
                                log("[Window-rivet " + _this.componentType + " Component] Specify an exact receiver origin, the configuration requires an update! Failing to specify an exact target origin exposes your application to a XSS attack vector.");
                            }
                            log(event);
                            _this.emit(event.data.event, event);
                        }
                    } catch (e) {
                        log(e);
                    }
                }
            };
            this.emit = function (type, event) {
                try {
                    var eventToEmit = new Event(type);
                    Object.assign(eventToEmit, { messageEvent: event });
                    if (_this.componentType === 'dispatcher') {
                        window.dispatchEvent(eventToEmit);
                    } else {
                        _this.target.dispatchEvent(eventToEmit);
                    }
                } catch (e) {
                    log(e);
                }
            };
            this.isSupported = function (event) {
                var supported = false;
                for (var i = 0; i < _this.supported_message_types.length; i++) {
                    if (_this.supported_message_types[i] === typeof event.data) {
                        supported = true;
                        break;
                    }
                }
                return supported;
            };
            this.message = function (payload, event) {
                try {
                    if (!payload) {
                        throw new Error('attempt to dispatch without payload');
                    } else if (!payload.event) {
                        throw new Error('attempt to dispatch without defining an event');
                    }
                    if (_this.targetOrigin === '*' && _this.warningOrigin) {
                        log("[Window-rivet " + _this.componentType + " Component] Specify an exact receiver origin, the configuration requires an update! Failing to specify an exact target origin exposes your application to a XSS attack vector.");
                    }
                    if (event) {
                        event.messageEvent.source.postMessage(payload, event.messageEvent.origin);
                    } else {
                        _this.target.postMessage(payload, _this.targetOrigin);
                    }
                } catch (e) {
                    log(e);
                }
            };
            this.trusted = function (origin) {
                var isTrusted = false;
                var originWhitelist = Configuration.getConfiguration('dispatcherOrigin');
                if (typeof originWhitelist === 'string' && originWhitelist === '*') {
                    isTrusted = true;
                }
                if (typeof originWhitelist === 'object') {
                    for (var i = 0; i < originWhitelist.length; i++) {
                        if (originWhitelist[i] === origin) {
                            isTrusted = true;
                            break;
                        }
                    }
                }
                return isTrusted;
            };
            this.componentType = componentType;
            this.warningOrigin = Configuration.getConfiguration('warningOrigin');
            // TOD0
            // Move this into the Configs default and allow developer to set
            // Thus the component is not bound to origin by type.
            if (componentType === 'dispatcher') {
                this.target = window.parent;
                this.targetOrigin = Configuration.getConfiguration('receiverOrigin');
            } else {
                this.target = window;
                this.targetOrigin = Configuration.getConfiguration('dispatcherOrigin');
            }
            SystemHooks.call(componentType);
            this.bind();
        }
        /**
        * Setup component, change specific behaviors, and enable or disable features.
        */
        ComponentBase.boot = function (componentType) {
            var componentName = componentType ? 'dispatcher' : 'receiver';
            SystemHooks.register(componentName, null, 'boot');
            var callback = function (arg) {
            };
            SystemHooks.register(componentName, callback);
        };
        return ComponentBase;
    }();

    var Dispatcher = /** @class */function (_super) {
        __extends(Dispatcher, _super);
        function Dispatcher() {
            return _super.call(this, 'dispatcher') || this;
        }
        return Dispatcher;
    }(ComponentBase);

    var Receiver = /** @class */function (_super) {
        __extends(Receiver, _super);
        function Receiver() {
            return _super.call(this, 'receiver') || this;
        }
        Receiver.boot = function () {
            ComponentBase.boot('receiver');
        };
        return Receiver;
    }(ComponentBase);

    var Kernel = /** @class */function (_super) {
        __extends(Kernel, _super);
        function Kernel() {
            var _this = _super.call(this) || this;
            _this.boot = function (configuration) {
                _this.setConfiguration(configuration);
                SystemHooks.boot();
                Dispatcher.boot();
                Receiver.boot();
                SystemHooks.call('mounted');
            };
            return _this;
        }
        return Kernel;
    }(Configuration);

    var SystemKernel = new Kernel();
    function Rivet(options) {
        SystemKernel.boot(options);
        this.dispatcher = Dispatcher;
        this.receiver = Receiver;
    }

    Rivet.version = '1.0.0';

    return Rivet;

})));
