import { AbstractKernel } from '../abstract/Kernel'
import { Configuration } from './Configuration'
import { SystemHooks } from './SystemHooks'
// TODO

import * as DISPATCHER from '../components/dispatcher'
import * as RECEIVER from '../components/receiver'


export class Kernel extends Configuration implements AbstractKernel{

    constructor () {
        super()
    }
   
    boot = (configuration?: object) => {

        this.setConfiguration(configuration)

        
        //HOOKS.boot()
        SystemHooks.boot()

        //TODO
        DISPATCHER.boot()
        RECEIVER.boot()   

        SystemHooks.call('mounted')

    }

    listSystemConfiguration = () => Configuration.listConfiguration()

} 