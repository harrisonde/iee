# Introduction
Rivet is a zero-dependency module that fasten separate domains to establish transparent bidirectional communication across origins.

## Documentation
### Usage
One-way messaging between privileged and non-privileged pages:
```js
    const Rivet = require('@cidekar/rivet')

    // New-up an instance if rivet 
    const rivet = new Rivet()
    
    // New-up the dispatcher
    const dispatcher = new rivet.dispatcher();

    // New-up the receiver
    const receiver = new rivet.receiver();

    // Dispatch single message from domain A.
    dispatcher.message({
        event: 'confirm', 
        message: 'Did you get my message?',
    });

    // Receive a message on domain B.
    receiver.listen('confirm', function(event){
        //... Handle message 
    });

```

## API

| Configuration      | Description   | 
| -------------      | ------------- |
| Dispatcher Origin  |               |
| Receiver Origin    |               |
| Origin Warning     | Display configuration waring in console; origin "*" exposes your application to a XSS attack vector. |

| Components     | Description   | 
| -------------  | ------------- |
| Dispatcher     |               |
| Receiver       |               |

| Events         | Description   | 
| -------------  | ------------- |
| Message        |               |
| On             |               |

| Hooks          | Description   | 
| -------------  | ------------- |
| Created        |  System startup, prepare to enter, record, and processed a configuration.              |
| Mounted        |  System has completely processed the configuration and ready to start messaging between components.            |


## Life Cycle
- Kernel is loaded executing a thin bootloader layer initializing the system.
- System hooks are created, components set into a ready state, and system is mounted to a domain.
- A new instance of the Dispatcher and Receiver are created returning methods for bidirectional communication bound to each domain Window object.
- A Dispatcher message is serialized and sent to a Receiver.
- The Receiver receives the message and validates the origin and shape. 
- Authorized messages are synchronously dispatched to the Window firing a callback function with the message from the Dispatcher.
- The Receiver sends a reply to the Dispatcher with a serialized message.