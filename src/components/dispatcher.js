import * as HOOKS from "../core/hooks"
import { get as configsGet} from  "../core/configs"
/**
 * Register a hook 
 * @param {String} Name The name of hook
 * @return null`
 */
function boot(){
    let callback = function(arg){ 
        if(typeof arg === 'function'){ 
            arg.apply(this, [arg] ) 
        }
    }
    HOOKS.register('dispatched', callback);   
}

/**
 * Target
 * @var {Object} target A reference to the window that will receive the message
 */
const TARGET = window.parent

/**
 * Send communication between TARGET using cross-origin communication post message
 * @param {*} payload Data to be sent to the TARGET; serialized using the structured clone algorithm
 */
function message(payload) {
    try{
        
        if(!payload){ 
            throw new Error('attempt to dispatch without payload');    
            return; 
        }
        else if(!payload.event){
            throw new Error('attempt to dispatch without defining an event');    
            return; 
        }
        
        TARGET.postMessage(payload, configsGet('receiverOrigin') );
        

    } catch(e) {
        console.warn(new Date(), '\n', e);
    }
}

export { boot, message }