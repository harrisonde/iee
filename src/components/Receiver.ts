import { SystemHooks } from '../core/SystemHooks';
import { ComponentBase } from './ComponentBase';

//TODO
import * as LOGGER from '../core/logger';


export class Receiver extends ComponentBase{

    constructor(){
        super('receiver')
    }
    
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
                }
            } catch (e) {
                LOGGER.log(e)
            }
        }
    }

    message = (payload, event?) => {
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
            
            if(event){
                event.source.postMessage(payload, event.origin)
            } else {
                this.target.postMessage(payload, this.targetOrigin)
            }
            

        } catch (e) {
            LOGGER.log(e)
        }
    }
    
    static boot = () => { 
        ComponentBase.boot('receiver')
    }
}