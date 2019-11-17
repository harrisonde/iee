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

    /**
     * Fire and update a hook related event bound into the system store.
     */
    static call = (name: string, args?: []) => {
        const hook = Kernel.listConfiguration('hooks')[name]
        if (typeof hook != 'undefined') {
            if (hook.callback){
                hook.callback.apply(SystemHooks, [args])
            }
            hook.lifecycle = true
            hook.lineage = hook.lineage.concat( ['call'])
        }
    }

    /**
     * Enter and record a hook related event into the system store.
     */
    static register = (name: string, callback: any = null, lifecycle: string = 'register') => {
        try {
            const hook = Kernel.listConfiguration('hooks')[name]

            if (typeof hook === 'undefined') {
                let hook = {
                    [name]: {
                        lifecycle: lifecycle,
                        callback: callback,
                        lineage: [lifecycle]
                    }
                }
                Kernel.putConfiguration('hooks', hook)
            } else if (typeof hook != 'undefined') {
                hook.callback = callback,
                hook.lifecycle = lifecycle
                hook.lineage = hook.lineage.concat([lifecycle])
            }
        } catch (e) {
            LOGGER.log(e)
        }
    }

    // TODO
    // Remove this utility method?!
    static list = (name: string) => {
        // Access to the Kernel cache required... how is it possible without new-up?
        return name ? STORE[name] : STORE
    }

    /**
     * Helper method to confirm the system is ready to handle communication.
     */
    static ready = (): boolean => {
        let isReady = false
        console.log(Kernel.listConfiguration('hooks'))
        const systemHooks = Kernel.listConfiguration('hooks')
        if (systemHooks['created'].lifecycle && systemHooks['mounted'].lifecycle){
            isReady = true
        }
        return isReady
    }

}