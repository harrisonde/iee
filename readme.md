# Introduction
Iframe Event Emitter is a zero-dependency module that allows transparent bidirectional communication across origins.

## Documentation
### Usage
One-way messaging between privileged and non-privileged pages:
```js
    const IEE = require('@cidekar/iframe-event-emitter')

    // New-up an instance dispatcher
    const dispatcher = new Iee({
        component: 'dispatcher'
    });

    // New-up an instance receiver
    const receiver = new Iee({
        component: 'receiver'  

    // Dispatch s single message
    dispatcher.message({
        event: 'confirm', 
        message: 'Did you get my message?',
    });

    // Receive a message
    receiver.on('confirm', function(event){
        //... Handle message 
    });

```

## API
hooks
    created
    mounted
config
    dispatcher origin
    receiver origin   
dispatcher
receiver
event 
message
on