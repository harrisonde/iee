/**!
 * Iee.js version 1.0.0
 * (c) 2014-2018 Harrison DeStefano
 * Released under the MIT License.
 */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global.Iee = factory());
}(this, (function () { 'use strict';

    const CONFIGS = {
        /**
         * Component
         * @var {String} component The type of component 
         */
        component: undefined,

        /**
         * Dispatcher Origin 
         * @var {String|Array} targetOrigin The origin of the reciever component
         */
        dispatcherOrigin: '*',

        /**
         * Receiver Origin 
         * @var {String|Array} targetOrigin The origin of the reciever component
         */
        receiverOrigin: '*'
    };

    var store = {};

    /**
     * Get a configuration
     * @param {String} config Name of a config 
     */
    function get(config){
        return store[config]

    }

    /**
     * Assign a given set of configuration options
     * @param {Object} options Configuration to set
     */
    function set(options){
        store = Object.assign(CONFIGS, options);
    }

    /**
     * Hooks
     * @var {Array} global hooks defining application state
     */
    const HOOKS = [
        'created',
        'mounted'
    ];

    /**
     * Hooks store
     * @var {Array} global hooks registered to application
     */
    const STORE = [];

    /**
     * Binds hooks global.
     * @param  {String} name a name
     * @return null
     */
    function bind() {
        let callback = function(arg){ 
            if(typeof arg === 'function'){ 
                arg.apply(this, [arg] ); 
            }
        };
        HOOKS.forEach(function(hook){
            try{
                register(hook, callback, true);        
            } catch(e){
                console.warn(new Date(), '\n', e);     
            }    
        });
    }

     /**
     * Call a hook
     * @param  {String} Name The name of a known hook
     * @param  {Array} args An list of arguments
     * @return null 
     */
    function call (name, args) {
        if(typeof STORE[name] != 'undefined'){
            STORE[name].callback.apply(this, [args]);
        }
    }
            
    /**
     * Register a hook 
     * @param {String} name The name of hook
     * @param {Function} callback A function to run with our hook
     * @param {Boolean} lifecycle Maintain the hook state
     * @return null
     */
    function register (name, callback, lifecycle){
        try{
            if(!callback){
               throw new Error('attempt to register ' + name + ' hook without callback')
            }
            if(typeof STORE[name] === 'undefined'){
                STORE[name] = {
                    callback: callback
                };
                if(lifecycle){
                    STORE[name].lifecycle = 'register';
                }
            } else {
                throw new Error('attempt to re-register ' + name)
            }     
        } catch(e){
            console.warn(new Date(), '\n', e);
        }
    }

    /**
     * List all hooks 
     * @param {String} name Key name of hook located in the store
     * @return {Array} hooks Global hooks defining application state
     */
    function list$1(name){
        return name ? STORE[name] : STORE
    }

    /**
     * Helper method use to boot hooks for usage
     * @param null
     * @return null
     */
    function boot(){
        bind();
        created();
        mounted();
    }

    /**
     * Helper method use to track global hooks while booting
     * @param null
     * @return null
     */
    function created() {
        let HOOK = 'created';
        call(HOOK, function(){
            STORE[HOOK].lifecycle = true;
        });
    }

    /**
     * Helper method use to track global hooks while booting
     * @param null
     * @return null
     */
    function mounted() {
        let HOOK = 'mounted';
        call(HOOK, function(){
            STORE[HOOK].lifecycle = true;
        });
    }

    /**
     * Register a hook 
     * @param {String} Name The name of hook
     * @return null`
     */
    function boot$1(){
        let callback = function(arg){ 
            if(typeof arg === 'function'){ 
                arg.apply(this, [arg] ); 
            }
        };
        register('dispatched', callback);   
    }

    /**
     * Target
     * @var {Object} target A reference to the window that will receive the message
     */
    const TARGET = window.parent;

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
            
            TARGET.postMessage(payload, get('receiverOrigin') );
            

        } catch(e) {
            console.warn(new Date(), '\n', e);
        }
    }

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
    ];

    /**
     * Target
     * @var {Object} target A reference to the window that will receive the message
     */
    const TARGET$1 = window;

    /**
     * Register a hook 
     * @param {String} Name The name of hook
     * @return null`
     */
    function boot$2(){
        let callback = function(arg){ 
            if(typeof arg === 'function'){ 
                arg.apply(this, [arg] ); 
            }
        };
        register('received', callback);
        register$1();
    }

    /**
     * Register a listener 
     * @param {String} Name The name of hook
     * @return null
     */
    function register$1() {
        TYPES.forEach(function(type){
            try{
                on(type.type, type.listener);
                //TARGET.addEventListener(, Iee.prototype.reciever.handler.bind(this), false);        
            } catch(e){
                console.warn(new Date(), '\n', e);      
            }    
        });
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
            TARGET$1.addEventListener(type, callback);
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
    ];

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
                    list$1('created').lifecycle === true &&  
                    list$1('mounted').lifecycle === true
                ){
                    emit(event.data.event, event.data);    
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
        let originWhitelist = get('dispatcherOrigin');
        
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
            Object.assign(eventToEmit, message);
            TARGET$1.dispatchEvent(eventToEmit);
        } catch(e){
            console.warn(new Date(), '\n', e); 
        }
    }

    /**
     * Boot
     * @param null
     * @return null
     */
    function boot$3 () {
        
        set(this);
        boot();
        boot$1();
        boot$2();   
    }

    function Iee (options) {    

        boot$3.apply(options);

        if(options.component === 'dispatcher'){
            this.message = message;
        } else if(options.component === 'reciever'){
            this.on = on;
        } else {
            console.warn(new Date(), '\n', 'did you register a component?');
        }

    }

    /**
     * The entry file will only contain exports export { <method> } from '/location/at/disk'
     * Use to remap for client sake of having to call Iee.Iee; now they are able to say 
     * something like Iee.listen; for example:
     * var ref = new Iee.listen()
     */

    return Iee;

})));
