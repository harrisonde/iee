import * as HOOKS from "../core/hooks"
import { get as configsGet} from  "../core/configs"

/**
 * Types
 * @var {Array} types A case-sensitive string representing the event type to listen for
 */
const TYPES = [
    {
        type: 'message',
        listener: handler
    },
    {
        type: 'build',
        listener: on
    }
]

/**
 * Target
 * @var {Object} target A reference to the window that will receive the message
 */
const TARGET = window

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
    HOOKS.register('received', callback);
    register()
}

/**
 * Register a listener 
 * @param {String} Name The name of hook
 * @return null
 */
function register() {
    TYPES.forEach(function(type){
        try{
            on(type.type, type.listener)
            //TARGET.addEventListener(, Iee.prototype.reciever.handler.bind(this), false);        
        } catch(e){
            console.warn(new Date(), '\n', e);      
        }    
    })
    //window.addEventListener("message", Iee.prototype.reciever.handler.bind(this), false); 
    //window.addEventListener('build', Iee.prototype.reciever.on.bind(this), false);
}

/**
 * Allowing options "on" event; Ssyntatic sugar
 * @param {String} type A case-sensitive string representing the event type to listen for
 * @param {Funtion} callback Function to call when the type is captured 
 * @return null
 */
function on(type, callback) {
    try{
        TARGET.addEventListener(type, callback);
    } catch(e){
        console.warn(new Date(), '\n', e); 
    }
} 


/**
 * White-list
 * @var {Array} supported_messgae_types White-list of supported types to dispatch
 */
const SUPPORTED_MESSAGES_TYPE = [
    'string', 
    'object'
]

/**
 * Handle dispatched events
 * @param {Object} event A dispatched event from post message
 */
function handler(event) {
   
    if(!trused(event.origin)){
        return
    }

    if(event.data){
        
        try{    
            if( 
                isSupported(event) &&
                HOOKS.list('created').lifecycle === true &&  
                HOOKS.list('mounted').lifecycle === true
            ){
                emit(event.data.event, event.data)    
            }
            
        } catch(e){
            console.warn(new Date(), '\n', e); 
        }
    }

    function isSupported(MessageEvent){
        var eventType = typeof MessageEvent.data;
        for(var i = 0; i < SUPPORTED_MESSAGES_TYPE.length; i++){
            if(SUPPORTED_MESSAGES_TYPE[i] === eventType){
                return true;
            }
        }
        return false;
    }
}

/**
 * Establish trust
 * @param {String} origin The origin where communication originated
 * @return {Boolean} trusted A truthy value
 */
function trused(origin){
    let originWhitelist = configsGet('dispatcherOrigin')
    
    if(typeof originWhitelist === 'string' && originWhitelist === '*'){
        return true
    }

    if(typeof originWhitelist === 'object'){
        for(var i = 0; i < originWhitelist.length; i++){
            if(originWhitelist[i] === origin){
                return true
            }
        }    
    }

    console.warn(new Date(), '\n', 'received untrused message from ' + origin); 

    return false
}
/**
 * 
 * @param {String} type A case-sensitive string representing the event type to emit
 * @param {Object} message A message to emit
 * @return null 
 */
function emit(type, message){
    try{
        var eventToEmit = new Event(type);
        Object.assign(eventToEmit, message)
        TARGET.dispatchEvent(eventToEmit);
    } catch(e){
        console.warn(new Date(), '\n', e); 
    }
}

export { boot, on }