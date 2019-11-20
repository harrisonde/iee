import * as LOGGER from './logger'
//import { Kernel } from './Kernel'
import { Configuration } from './Configuration'

export class SystemHooks {

    static bind = (): void => {
        const callback = (arg): void => {
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

    /**
     * Start system, prepare to enter, record, and processed the configuration.
     */
    static boot = (): void => {
        SystemHooks.bind()
        SystemHooks.call('created')
    }

    /**
     * Fire and update a hook related event bound into the system store.
     */
    static call = (name: string, args?: []): void => {
        const hook = Configuration.listConfiguration('hooks')[name]
        if (typeof hook != 'undefined') {
            if (hook.callback){
                hook.callback.apply(SystemHooks, [args])
            }
            hook.lifecycle = true
            hook.lineage = hook.lineage.concat( ['ready'])
        }
    }

    /**
     * Enter and record a hook related event into the system store.
     */
    static register = (name: string, callback: Function = null, lifecycle = 'register'): void => {
        try {
            const hook = Configuration.listConfiguration('hooks')[name]

            if (typeof hook === 'undefined') {
                const hook = {
                    [name]: {
                        lifecycle: lifecycle,
                        callback: callback,
                        lineage: [lifecycle]
                    }
                }
                Configuration.putConfiguration('hooks', hook)
            } else if (typeof hook != 'undefined') {
                hook.callback = callback,
                hook.lifecycle = lifecycle
                hook.lineage = hook.lineage.concat([lifecycle])
            }
        } catch (e) {
            LOGGER.log(e)
        }
    }

    /**
     * Helper method to confirm the system is ready to handle communication.
     */
    static ready = (): boolean => {
        let isReady = false
        const systemHooks = Configuration.listConfiguration('hooks')
        if (!systemHooks) return isReady
        if (systemHooks['created'].lifecycle && systemHooks['mounted'].lifecycle){
            isReady = true
        }
        return isReady
    }

}