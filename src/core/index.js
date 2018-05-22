import { boot } from './bootstrap'
import { message } from '../components/dispatcher'
import { on } from '../components/receiver'
import * as LOGGER from '../core/logger'

function Iee (options) {    

    boot.apply(options)

    if(options.component === 'dispatcher'){
        this.message = message
    } else if(options.component === 'receiver'){
        this.on = on
    } else {
        LOGGER.log('did you register a component?')
    }

}
 
export default Iee  