import { AbstractComponentBase } from '../abstract/Component'
import { SystemHooks } from '../core/SystemHooks'
import { Kernel } from '../core/Kernel';


//TODO
import * as LOGGER from '../core/logger'
import { ComponentBase } from './ComponentBase';


export class Receiver extends ComponentBase{

    // Moved to Component base
    // /**
    // * Reference to the window that will receive the message
    // */
    // TARGET = window;

    // Moved to Component Base
    // /**
    //  * Whitelist of supported types received.
    //  */
    // SUPPORTED_MESSAGES_TYPE = [
    //     'string',
    //     'object'
    // ]


    // TODO 
    // Need to get this into the component
    // private targetOrigin = Kernel.getConfiguration('dispatcherOrigin')
    // private warningOrigin = Kernel.getConfiguration('warningOrigin')
    
    constructor(){
        super('receiver')
        // Moved to ComponentBase
        // SystemHooks.call('receiver')
        // this.bind()
    }

    // /**
    //  * A bit of syntactic sugar to setup a function to be called when a event is delivered to the target.
    //  */
    // public bind = () => {
        
    //     /**
    //      * A case-sensitive string representing the event type to listen for.
    //      */
    //     const TYPES = [
    //         {
    //             type: 'message',
    //             listener: this.handler
    //         }
    //     ]
        
    //     TYPES.forEach(type => {
    //         try {
    //             this.listen(type.type, type.listener)
    //         } catch (e) {
    //             LOGGER.log(e)
    //         }
    //     })
    // }

    /**
     * Handle dispatched events.
     */
    handler = (event: object) => {
        if (!this.trusted(event.origin)) {
            return
        }
        if (event.data) {
            try {
                if ( this.isSupported(event) && SystemHooks.ready()){
                    if (this.targetOrigin === '*' && this.warningOrigin) {
                        LOGGER.log('[Receiver Component] Specify an exact receiver origin, the configuration requires an update! Failing to specify an exact target origin exposes your application to a XSS attack vector.')
                    }
                    LOGGER.log(event)
                    this.emit(event.data.event, event.data)
                    
                    // Try to send a response to the dispatcher
                    event.source.postMessage({
                        event: 'response',
                        message: 'yes'
                    }, event.origin)
                    
                }
            } catch (e) {
                LOGGER.log(e)
            }
        }
    }

    /**
    //  * Establish trust by validating the origin where communication originated.
    //  */
    // private trusted = (origin: string): boolean => { 
    //     let isTrusted = false
    //     let originWhitelist = Kernel.getConfiguration('dispatcherOrigin')

    //     if (typeof originWhitelist === 'string' && originWhitelist === '*') {
    //         isTrusted = true
    //     }

    //     if (typeof originWhitelist === 'object') {
    //         for (var i = 0; i < originWhitelist.length; i++) {
    //             if (originWhitelist[i] === origin) {
    //                 isTrusted = true
    //                 break
    //             }
    //         }
    //     }
    //     return isTrusted
    // }

    // /**
    //  * Setup method to handle dispatched communication called on communication delivery.
    //  */

    // // was "on"
    // private listen = (event: string, callback:any) => {
    //     try {            
    //         //console.log(`Added event listener to ${this.TARGET} for ${event} and cb ${callback}`)
    //         this.TARGET.addEventListener(event, callback)
    //     } catch (e) {
    //         LOGGER.log(e)
    //     }
    // }

    // /**
    //  * Synchronously emits event message to a target.
    //  */
    // private emit = (type: string, message: object) => {
    //     try {
    //         const eventToEmit = new Event(type)
    //         Object.assign(eventToEmit, message)
    //         this.TARGET.dispatchEvent(eventToEmit)
    //     } catch (e) {
    //         LOGGER.log(e)
    //     }
    // }

    // /**
    //  * Validate the shape of the event.
    //  */
    // private isSupported = (event): boolean => { 
    //     let supported = false
    //     var eventType = typeof event.data
    //     for (var i = 0; i < this.SUPPORTED_MESSAGES_TYPE.length; i++) {
    //         if (this.SUPPORTED_MESSAGES_TYPE[i] === eventType) {
    //             supported = true
    //             break
    //         }
    //     }
    //     return supported
    // }

    message = (payload, event?) => { // Alias for emit?
        try {
            console.log('receiver message called')
            if (!payload) {
                throw new Error('attempt to dispatch without payload')
            }
            else if (!payload.event) {
                throw new Error('attempt to dispatch without defining an event')
            }

            if (this.targetOrigin === '*' && this.warningOrigin) {
                LOGGER.log('[Dispatcher Component] Specify an exact receiver origin, the configuration requires an update! Failing to specify an exact target origin exposes your application to a XSS attack vector.')
            }
            
            if(event){
                event.source.postMessage(payload, event.origin)
            } else {
                this.target.postMessage(payload, this.targetOrigin)
            }
            

        } catch (e) {
            LOGGER.log(e)
        }
    } 

    // /**
    //  * Put receiver into a ready state within the system.
    //  */
    // static boot = () => {
    //     SystemHooks.register('receiver', null, 'boot')
    //     Receiver.register()
    // }

    // /**
    //  * Enter, record, fire, and update a hook related event into the system store.
    //  */
    // static register = () => {
    //     let callback = arg => {
    //         if (typeof arg === 'function') {
    //             arg.apply(Receiver, [arg])
    //         }
    //     }
    //     SystemHooks.register('receiver', callback)
    // }

}