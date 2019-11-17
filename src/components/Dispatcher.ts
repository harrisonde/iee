import { AbstractComponentBase } from '../abstract/Component'
import { SystemHooks } from '../core/SystemHooks'
import { Kernel } from '../core/Kernel';

// TODO
import * as LOGGER from '../core/logger'
import { ComponentBase } from './ComponentBase';


export class Dispatcher extends ComponentBase {
    
    // Moved to component base
    // /**
    // * Reference to the window that will receive the message
    // */
    // TARGET = window.parent;

    //private targetOrigin = Kernel.getConfiguration('receiverOrigin')
    //private warningOrigin = Kernel.getConfiguration('warningOrigin')

    constructor() {
        super('dispatcher')
        
        // Move to ComponentBase
        // SystemHooks.call('dispatcher')
        // this.bind()
    }

    // static boot = () => {
    //     SystemHooks.register('dispatcher', null, 'boot')
    //     Dispatcher.register()
    // }

    // static register = () => {
    //     let callback = arg => {
    //         if (typeof arg === 'function') {
    //             arg.apply(Dispatcher, [arg])
    //         }
    //     }
    //     SystemHooks.register('dispatcher', callback)
    // }

     // Same method from Receiver. 
    //
    //
    
    // Moved to component base
    // message = payload => {
    //     try {

    //         if (!payload) {
    //             throw new Error('attempt to dispatch without payload')
    //         }
    //         else if (!payload.event) {
    //             throw new Error('attempt to dispatch without defining an event')
    //         }

    //         if (this.targetOrigin === '*' && this.warningOrigin){
    //             LOGGER.log('[Dispatcher Component] Specify an exact receiver origin, the configuration requires an update! Failing to specify an exact target origin exposes your application to a XSS attack vector.')
    //         }
    //         this.TARGET.postMessage(payload, this.targetOrigin)

    //     } catch (e) {
    //         LOGGER.log(e)
    //     }
    // }

    // Moved to ComponentBase method
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

    // Moved to ComponentBase method
    // /**
    // * Handle dispatched events.
    // */
    // private handler = (event: object) => {
    //     console.log('dispatch handler called')
    //     if (!this.trusted(event.origin)) {
    //         return
    //     }
    //     if (event.data) {
    //         try {
    //             if (this.isSupported(event) && SystemHooks.ready()) {
    //                 if (this.targetOrigin === '*' && this.warningOrigin) {
    //                     LOGGER.log('[Receiver Component] Specify an exact receiver origin, the configuration requires an update! Failing to specify an exact target origin exposes your application to a XSS attack vector.')
    //                 }
    //                 LOGGER.log(event)
    //                 this.emit(event.data.event, event.data)
    //                 this.DISPATCHER = event.source
    //             }
    //         } catch (e) {
    //             LOGGER.log(e)
    //         }
    //     }
    //}

    // /**
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

    // Moved to ComponentBase method
    // /**
    //  * Setup method to handle dispatched communication called on communication delivery.
    //  */

    // // was "on"
    // private listen = (event: string, callback: any) => {
    //     try {
    //         this.TARGET.addEventListener(event, callback)
    //     } catch (e) {
    //         LOGGER.log(e)
    //     }
    // }

    // Moved to ComponentBase method
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

    // Moved to ComponentBase Method
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
}