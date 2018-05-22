import * as CONFIGURATION from  './configs'
import * as HOOKS from './hooks'
import * as DISPATCHER from '../components/dispatcher'
import * as RECEIVER from '../components/receiver'

/**
 * Boot
 * @param null
 * @return null
 */
function boot () {
    
    CONFIGURATION.set(this)
    HOOKS.boot()
    DISPATCHER.boot()
    RECEIVER.boot()   
}

export { boot }