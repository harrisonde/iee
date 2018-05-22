import * as CONFIGURATION from  './configs'
import * as HOOKS from './hooks'
import * as DISPATCHER from '../components/dispatcher'
import * as RECIEVER from '../components/reciever'

/**
 * Boot
 * @param null
 * @return null
 */
function boot () {
    
    CONFIGURATION.set(this)
    HOOKS.boot()
    DISPATCHER.boot()
    RECIEVER.boot()   
}

export { boot }