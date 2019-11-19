/*eslint no-console: ["error", { allow: ["warn"] }] */

import { Kernel } from '../core/Kernel';

/**
 * Log a message to the console.
 * @param {String} message A message to display in the console
 * @return null
 */
function log(message): void{
    if (!Kernel.getConfiguration('silent')){
        console.warn(message)
    }
}

export { log }