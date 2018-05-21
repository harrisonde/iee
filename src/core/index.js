import { boot } from "./bootstrap"
import { message } from "../components/dispatcher"
import { on } from "../components/reciever"


function Iee (options) {    

    boot.apply(options)

    if(options.component === 'dispatcher'){
        this.message = message
    } else if(options.component === 'reciever'){
        this.on = on
    } else {
        console.warn(new Date(), '\n', 'did you register a component?')
    }

}
 
export default Iee