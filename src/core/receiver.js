function _reciever () {
    
    Iee.prototype.reciever = {
        listen: function(){
            //Add Listeners
            window.addEventListener("message", Iee.prototype.reciever.handler.bind(this), false); 
            window.addEventListener('build', Iee.prototype.reciever.on.bind(this), false);
        },
        handler: function (event){
            // Dispatcher supplied event
            // Message event passed from a child window
            var MessageEvent = event;

            // Trust established?
            // TODO 
            //if (event.origin.match(new RegExp('^'+this.reciever.origin+'$')))
                //  this.logger(event.origin + 'is not trusted')
                //  return
            if(MessageEvent.data){
                try{    
                    if(this.lifecycle.created && this.lifecycle.mounted && isSupported(MessageEvent, this.defaults.supportedTypes)){
                        // Emit event
                        try{
                            // Tryig for an " on " method
                            // Emit another event the in the partent window
                            var eventToEmit = new Event(MessageEvent.data.event);
                            Object.assign(eventToEmit, MessageEvent.data)
                            window.dispatchEvent(eventToEmit);
                        } catch(e){
                            console.warn(new Date(), '\n', e); 
                        }
                    
                        // Hook    
                        this.hooks.process('received', function(){
                            //JSON.parse(event.data)
                            console.log(MessageEvent);    
                        });    
                    }
                    
                } catch(e){
                    console.warn(new Date(), '\n', e); 
                }
            }

            function isSupported(MessageEvent, supportedTypes){
                var eventType = typeof MessageEvent.data;
                for(var i = 0; i < supportedTypes.length; i++){
                    if(supportedTypes[i] === eventType){
                        return true;
                    }
                }
                return false;
            }
        },

        on: function(event, callback){
            // Store custom events
            console.log('adding '+event+' event listener from parent window')
            try{
                window.addEventListener(event, callback);
            } catch(e){
                console.warn(new Date(), '\n', e); 
            }
        }    
    }
}

export { _reciever }