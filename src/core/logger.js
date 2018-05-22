/*eslint no-console: ["error", { allow: ["warn"] }] */

import * as CONFIGURATION from  './configs'

/**
 * Log a message to the console.
 * @param {String} message A message to display in the console
 * @return null
 */
function log(message){
    console.warn(CONFIGURATION.get('silent'))
    if(!CONFIGURATION.get('silent')){
        console.warn(new Date(), '\n', message)
    }
}

export { log }