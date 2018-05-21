// Dispatcher

function _disptach () {
    Iee.prototype.dispatch = {
  
        message: function(payload){
            try{
                
                // Do not pass empty payloads
                if(!payload){ 
                    return; 
                }
                else if(!payload.event){
                    throw new Error('attempt to dispatch without defining an event');    
                }
                
                // Reference the publsher and current window; a bit of sugar
                var recieverWindow = window.parent;
                
                // Dispatch a message to any target
                // TODO 
                // add target to options
                recieverWindow.postMessage(payload, '*');
    
            } catch(e) {
                console.warn(new Date(), '\n', e);
            }
        }
    }
}

export { _dispatch }