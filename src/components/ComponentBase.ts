import { AbstractComponentBase } from '../abstract/Component'
import { SystemHooks } from '../core/SystemHooks'
//import { Kernel } from '../core/Kernel';
import { Configuration } from '../core/Configuration'

// TODO
import * as LOGGER from '../core/logger'


interface MessageEvent {
    data: any,
    origin: string
}

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

    componentType: string = null

    constructor(componentType: string) {
        
        this.componentType = componentType
        
        this.warningOrigin = Configuration.getConfiguration('warningOrigin')

        // TOD0
        // Move this into the Configs default and allow developer to set
        // Thus the component is not bound to origin by type.
        if (componentType === 'dispatcher') {
            this.target = window.parent
            this.targetOrigin = Configuration.getConfiguration('receiverOrigin')
        }
        else {
            this.target = window
            this.targetOrigin = Configuration.getConfiguration('dispatcherOrigin')
        }
      
        SystemHooks.call(componentType)

        this.bind()
    }


    bind = (): void => {
        this.listen('message', this.handler)
    }

    listen = (eventType: string, callback: Function): void => {
        
        try {
            window.addEventListener(eventType, callback)
        } catch (e) {
            LOGGER.log(e)
        }
    }

    handler = (event): void => {
        
        // Validate origin 
        if (!this.trusted(event.origin)) {
            return
        }
        
        // Validate
        if (event.data) {
            try {
                if (this.isSupported(event) && SystemHooks.ready()) {
                    if (this.targetOrigin === '*' && this.warningOrigin) {
                        LOGGER.log(`[Window-rivet ${this.componentType} Component] Specify an exact receiver origin, the configuration requires an update! Failing to specify an exact target origin exposes your application to a XSS attack vector.`)
                    }
                    LOGGER.log(event)
                    this.emit(event.data.event, event)
                }
            } catch (e) {
                LOGGER.log(e)
            }
        }
    }

    emit = (type: string, event: object): void => {
        try {
            const eventToEmit = new Event(type)
            Object.assign(eventToEmit, { messageEvent: event })
        
            if(this.componentType === 'dispatcher'){
                window.dispatchEvent(eventToEmit)
            } else {
                this.target.dispatchEvent(eventToEmit)
            }
            
        } catch (e) {
            LOGGER.log(e)
        }
    }

    isSupported = (event): boolean => {
        let supported = false
        for (let i = 0; i < this.supported_message_types.length; i++) {
            if (this.supported_message_types[i] === typeof event.data) {
                supported = true
                break
            }
        }
        return supported
    }

    message = (payload, event?): void => {  
        try {

            if (!payload) {
                throw new Error('attempt to dispatch without payload')
            }
            else if (!payload.event) {
                throw new Error('attempt to dispatch without defining an event')
            }

            if (this.targetOrigin === '*' && this.warningOrigin) {
                LOGGER.log(`[Window-rivet ${this.componentType} Component] Specify an exact receiver origin, the configuration requires an update! Failing to specify an exact target origin exposes your application to a XSS attack vector.`)
            }
            
        
            if (event) {
                event.messageEvent.source.postMessage(payload, event.messageEvent.origin)
            } else {
                this.target.postMessage(payload, this.targetOrigin)
            }

        } catch (e) {
            LOGGER.log(e)
        }
    }

    trusted = (origin: string): boolean => {
        let isTrusted = false
        const originWhitelist = Configuration.getConfiguration('dispatcherOrigin')

        if (typeof originWhitelist === 'string' && originWhitelist === '*') {
            isTrusted = true
        }

        if (typeof originWhitelist === 'object') {
            for (let i = 0; i < originWhitelist.length; i++) {
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
    static boot(componentType?: string): void {
        const componentName = componentType ? 'dispatcher' : 'receiver'
        
        SystemHooks.register(componentName, null, 'boot')
        const callback = (arg): void => {
            if (typeof arg === 'function') {
                // TODO
                // Need to implement
                // arg.apply(Dispatcher, [arg])
            }
        }
        SystemHooks.register(componentName, callback)
    }
    
}