import { AbstractKernel } from '../abstract/Kernel'
import { Configuration } from './Configuration'
import { SystemHooks } from './SystemHooks'
import { Dispatcher } from '../components/Dispatcher'
import { Receiver } from '../components/Receiver'


export class Kernel extends Configuration implements AbstractKernel{

    constructor () {
        super()
    }
   
    boot = (configuration?: object): void => {

        this.setConfiguration(configuration)
        
        SystemHooks.boot()

        Dispatcher.boot()
        
        Receiver.boot()   

        SystemHooks.call('mounted')

    }
} 