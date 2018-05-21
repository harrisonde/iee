import { boot } from "./bootstrap"
import { message } from "../components/dispatcher"
import { on } from "../components/reciever"


function Iee (options) {    
    this.defaults = {
        component:  options && options.component || null,
        suppoPtedTypes: options && options.supportedTypes || ['string', 'object'] // structured clone algorithm only
    }
    
    this.lifecycle = {
        created: null,
        mounted: null
    }

    boot.apply(this)

    if(this.defaults.component === 'dispatcher'){
        this.message = message
    } else if(this.defaults.component === 'reciever'){
        this.on = on
    } else {
        console.warn(new Date(), '\n', 'did you register a component?')
    }

}
 
export default Iee