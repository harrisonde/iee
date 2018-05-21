/**
 * The entry file will only contain exports export { <method> } from '/location/at/disk'
 * Use to remap for client sake of having to call Iee.Iee; now they are able to say 
 * something like Iee.listen; for example:
 * var ref = new Iee.listen()
 */

//export { Iee as V } from '../../core/index'
export { default } from '../../core/index'