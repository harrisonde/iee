import * as LOGGER from '../core/logger'

/**
 * Hooks
 * @var {Array} global hooks defining application state
 */
const HOOKS = [
    'created',
    'mounted'
]

/**
 * Hooks store
 * @var {Array} global hooks registered to application
 */
const STORE = []

/**
 * Binds hooks global.
 * @param  {String} name a name
 * @return null
 */
function bind() {
    let callback = function(arg){ 
        if(typeof arg === 'function'){ 
            arg.apply(this, [arg] ) 
        }
    }
    HOOKS.forEach(function(hook){
        try{
            register(hook, callback, true)        
        } catch(e){
            LOGGER.log(e)     
        } 
    })
}

/**
 * Call a hook
 * @param  {String} Name The name of a known hook
 * @param  {Array} args An list of arguments
 * @return null 
 */
function call (name, args) {
    if(typeof STORE[name] != 'undefined'){
        STORE[name].callback.apply(this, [args])
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
            }
            if(lifecycle){
                STORE[name].lifecycle = 'register'
            }
        } else {
            throw new Error('attempt to re-register ' + name)
        }     
    } catch(e){
        LOGGER.log(e)
    }
}

/**
 * List all hooks 
 * @param {String} name Key name of hook located in the store
 * @return {Array} hooks Global hooks defining application state
 */
function list(name){
    return name ? STORE[name] : STORE
}

/**
 * Helper method use to boot hooks for usage
 * @param null
 * @return null
 */
function boot(){
    bind()
    created()
    mounted()
}

/**
 * Helper method use to track global hooks while booting
 * @param null
 * @return null
 */
function created() {
    let HOOK = 'created'
    call(HOOK, function(){
        STORE[HOOK].lifecycle = true
    })
}

/**
 * Helper method use to track global hooks while booting
 * @param null
 * @return null
 */
function mounted() {
    let HOOK = 'mounted'
    call(HOOK, function(){
        STORE[HOOK].lifecycle = true
    })
}

export { call, boot, list, register, STORE }