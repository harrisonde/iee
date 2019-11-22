import { SystemHooks } from '../core/SystemHooks';
import { ComponentBase } from './ComponentBase';

//TODO
import * as LOGGER from '../core/logger';


export class Receiver extends ComponentBase{

    constructor(){
        super('receiver')
    }
    
    handler = (event: object): void => {
        console.log('R handler called handler', event)
        if (!this.trusted(event.origin)) {
            return
        }
        if (event.data) {
            try {
                if ( this.isSupported(event) && SystemHooks.ready()){
                    if (this.targetOrigin === '*' && this.warningOrigin) {
                        LOGGER.log(`[Window-rivet ${this.componentType} Component] Specify an exact receiver origin, the configuration requires an update! Failing to specify an exact target origin exposes your application to a XSS attack vector.`)
                    }
                    LOGGER.log(event)
                    this.emit(event.data.event, event.data)
                }
            } catch (e) {
                LOGGER.log(e)
            }
        }
    }

    // message = (payload, event?): void => {
    //     try {
    //         if (!payload) {
    //             throw new Error('attempt to dispatch without payload')
    //         }
    //         else if (!payload.event) {
    //             throw new Error('attempt to dispatch without defining an event')
    //         }

    //         if (this.targetOrigin === '*' && this.warningOrigin) {
    //             LOGGER.log(`[Window-rivet ${this.componentType} Component] Specify an exact receiver origin, the configuration requires an update! Failing to specify an exact target origin exposes your application to a XSS attack vector.`)
    //         }
            
    //         if(event){
    //             event.source.postMessage(payload, event.origin)
    //         } else {
    //             this.target.postMessage(payload, this.targetOrigin)
    //         }
            

    //     } catch (e) {
    //         LOGGER.log(e)
    //     }
    // }
    
    static boot = (): void => { 
        ComponentBase.boot('receiver')
    }
}