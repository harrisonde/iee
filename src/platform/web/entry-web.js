/**
 * The entry file will only contain exports export { <method> } from '/location/at/disk'
 * Use to remap for client sake of having to call Iee.Iee; now they are able to say 
 * something like Iee.listen; for example:
 * var ref = new Iee.listen()
 */

import IframeEventEmitter from '../../core/index'

IframeEventEmitter.version = '__VERSION__'

export default IframeEventEmitter