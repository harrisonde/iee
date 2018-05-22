import { boot } from './bootstrap'
import { message } from '../components/dispatcher'
import { on } from '../components/reciever'
import * as LOGGER from '../core/logger'

function Iee (options) {    

    boot.apply(options)

    if(options.component === 'dispatcher'){
        this.message = message
    } else if(options.component === 'reciever'){
        this.on = on
    } else {
        LOGGER.log('did you register a component?')
    }

}
 
export default Iee  