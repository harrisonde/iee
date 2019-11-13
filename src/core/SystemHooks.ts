import { AbstractHooks } from '../abstract/Hooks'

import * as LOGGER from './logger'
import { Kernel } from './Kernel'

export class SystemHooks implements AbstractHooks{

    static bind = () => {
        const callback = (arg) => {
            if (typeof arg === 'function') {
                //arg.apply(this, [arg])
            }
        }

        const hooks = ['created', 'mounted']

        hooks.forEach(function (hook) {
            try {
                SystemHooks.register(hook, callback)
            } catch (e) {
                LOGGER.log(e)
            }
        })
    }

    static boot = () => {
        SystemHooks.bind()
        SystemHooks.call('created')
    }

    static call = (name: string, args?: []) => {
        const hook = Kernel.listConfiguration('hooks')[name]
        if (typeof hook != 'undefined') {
            hook.callback.apply(SystemHooks, [args])
            hook.lifecycle = true
        }
    }

    static register = (name: string, callback) => {
        // Access to the Kernel cache required... how is it possible without new-up?
        try {
            if (!callback) {
                throw new Error('attempt to register ' + name + ' hook without callback')
            }
            if (typeof Kernel.listConfiguration('hooks')[name] === 'undefined') {
                let hook = {
                    [name]: {
                        lifecycle: 'register',
                        callback: callback

                    }
                }
                Kernel.putConfiguration('hooks', hook)

            } else {
                throw new Error('attempt to re-register ' + name)
            }
        } catch (e) {
            LOGGER.log(e)
        }
    }

    static list = (name: string) => {
        // Access to the Kernel cache required... how is it possible without new-up?
        return name ? STORE[name] : STORE
    }

}