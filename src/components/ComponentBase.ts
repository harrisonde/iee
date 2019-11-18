import { AbstractComponentBase } from '../abstract/Component'
import { SystemHooks } from '../core/SystemHooks'
import { Kernel } from '../core/Kernel';

// TODO
import * as LOGGER from '../core/logger'

// Extend Component base with sub components 
// this will provide fallback methods.
export class ComponentBase implements AbstractComponentBase {

    supported_message_types = [
        'string',
        'object'
    ]

    target = null
    
    targetOrigin = null
    
    warningOrigin = null

    constructor(componentType: string) {

        this.warningOrigin = Kernel.getConfiguration('warningOrigin')

        // TOD0
        // Move this into the Configs default and allow developer to set
        // Thus the component is not bound to origin by type.
        if (componentType === 'dispatcher') {
            this.target = window.parent
            this.targetOrigin = Kernel.getConfiguration('receiverOrigin')
        }
        else {
            this.target = window
            this.targetOrigin = Kernel.getConfiguration('dispatcherOrigin')
        }

        SystemHooks.call(componentType)

        this.bind(componentType)
    }


    bind = (componentType) => {
        this.listen('message', this.handler)
    }

    listen = (event: string, callback: any) => {
        try {
            this.target.addEventListener(event, callback)
        } catch (e) {
            LOGGER.log(e)
        }
    }

    handler = (event) => {
        
        // Validate origin 
        if (!this.trusted(event.origin)) {
            return
        }
        
        // Validate
        if (event.data) {
            try {
                if (this.isSupported(event) && SystemHooks.ready()) {
                    if (this.targetOrigin === '*' && this.warningOrigin) {
                        LOGGER.log('[Receiver Component] Specify an exact receiver origin, the configuration requires an update! Failing to specify an exact target origin exposes your application to a XSS attack vector.')
                    }
                    LOGGER.log(event)
                    this.emit(event.data.event, event.data)
                }
            } catch (e) {
                LOGGER.log(e)
            }
        }
    }

    emit = (type: string, message: object) => {
        try {
            const eventToEmit = new Event(type)
            Object.assign(eventToEmit, message)
            this.target.dispatchEvent(eventToEmit)
        } catch (e) {
            LOGGER.log(e)
        }
    }

    isSupported = (event): boolean => {
        let supported = false
        var eventType = typeof event.data
        for (var i = 0; i < this.supported_message_types.length; i++) {
            if (this.supported_message_types[i] === typeof event.data) {
                supported = true
                break
            }
        }
        return supported
    }

    message = payload => {
        
        try {

            if (!payload) {
                throw new Error('attempt to dispatch without payload')
            }
            else if (!payload.event) {
                throw new Error('attempt to dispatch without defining an event')
            }

            if (this.targetOrigin === '*' && this.warningOrigin) {
                LOGGER.log('[Dispatcher Component] Specify an exact receiver origin, the configuration requires an update! Failing to specify an exact target origin exposes your application to a XSS attack vector.')
            }
            this.target.postMessage(payload, this.targetOrigin)

        } catch (e) {
            LOGGER.log(e)
        }
    }

    trusted = (origin: string): boolean => {
        let isTrusted = false
        let originWhitelist = Kernel.getConfiguration('dispatcherOrigin')

        if (typeof originWhitelist === 'string' && originWhitelist === '*') {
            isTrusted = true
        }

        if (typeof originWhitelist === 'object') {
            for (var i = 0; i < originWhitelist.length; i++) {
                if (originWhitelist[i] === origin) {
                    isTrusted = true
                    break
                }
            }
        }
        return isTrusted
    }

    /**
    * Setup component, change specific behaviors, and enable or disable features.
    */
    static boot(componentType?: string) {
        const componentName = componentType ? 'dispatcher' : 'receiver'
        
        SystemHooks.register(componentName, null, 'boot')
        let callback = arg => {
            if (typeof arg === 'function') {
                // TODO
                // Need to fix
                // arg.apply(Dispatcher, [arg])
            }
        }
        SystemHooks.register(componentName, callback)
    }
    
}