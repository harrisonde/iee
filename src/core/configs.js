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
    receiverOrigin: '*',

    /**
     * Silent
     * @var {Boolean} silent 
     */
    silent: 'BUILD_TARGET' === 'web-min-js'
}

var store = {}

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
    store = Object.assign(CONFIGS, options)
}

/**
 * List all configurationa
 * @param {String} config Name of a config 
 */
function list(){
    return store
}
export { get, set, list }