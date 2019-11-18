# Introduction
Rivet is a zero-dependency module for transparent bidirectional communication across origins by fastening separate domains together.

## Documentation
### Usage
#### One-way messaging between a privileged and non-privileged domain:

Domain A
```js
    const Rivet = require('@cidekar/rivet')

    // New-up an instance if rivet 
    const rivet = new Rivet()
    
    // New-up the dispatcher
    const dispatcher = new rivet.dispatcher();

    // Dispatch single message from domain A.
    dispatcher.message({
        event: 'confirm', 
        message: 'Did you get my message?',
    });
```

Domain B
```js
    const Rivet = require('@cidekar/rivet')

    // New-up an instance if rivet 
    const rivet = new Rivet()

    // New-up the receiver
    const receiver = new rivet.receiver();

    // Receive a message on domain B.
    receiver.listen('confirm', function(event){
        //... Handle message 
    });
```

#### Bidirectional messaging between a privileged and non-privileged domain:

Domain A
```js
    const Rivet = require('@cidekar/rivet')

    // New-up an instance if rivet 
    const rivet = new Rivet()
    
    // New-up the dispatcher
    const dispatcher = new rivet.dispatcher();

    // Receive a message from domain B.
    dispatcher.listen('response', function (event) {
        //... handle the reply 
    })

    // Dispatch a message from domain A.
    dispatcher.message({
        event: 'confirm', 
        message: 'Did you get my message?',
    });
```

Domain B
```js
    const Rivet = require('@cidekar/rivet')

    // New-up an instance of rivet 
    const rivet = new Rivet()

    // New-up the receiver
    const receiver = new rivet.receiver();

    // A Simple reply function
    function reply(response, event) {
        receiver.message(response, event)
    }

    // Receive a message from domain A and reply.
    receiver.listen('confirm', function(event){
        reply({
            event: 'response',
            message: 'Yes. Thank you for asking!',
        })
    });

```

## API
### Configuration
| Option | Default | Description   | 
| ------------- | ------------- | ------------- |
| Dispatcher Origin | * | The origin of Dispatcher component. |
| Receiver Origin | * | The origin of Receiver component.   |
| Origin Warning  | True | Display configuration waring in console; origin "*" exposes your application to a XSS attack vector. |

### Components
| Type     | Description   | 
| -------------  | ------------- |
| Dispatcher     | Create, serialize and transfer messages. |
| Receiver       | Listen, validate, and handel messages. |

### Events
| Type         | Description   | 
| -------------  | ------------- |
| Message        |  Message a target; { event: string, and message: string}  |
| Listen         |  Listen for a message; { event: string, message: string } |

### Hooks
| Type           | Life Cycle | Description   | 
| -------------  | ------------- | ------------- |
| Created        |  Boot, Register, Call | System startup, prepare to enter, record, and processed a configuration.              |
| Mounted        |   Boot, Register, Call | System has completely processed the configuration and ready for communication.            |

#### Life Cycle
- Kernel is loaded executing a thin bootloader layer initializing the system.
- System hooks are created, components set into a ready state, and system is mounted to a domain.
- A new instance of the Dispatcher and Receiver are created returning methods for bidirectional communication bound to each domain Window object.
- A Dispatcher message is serialized and sent to a Receiver.
- The Receiver receives the message and validates the origin and shape. 
- Authorized messages are synchronously dispatched to the Window firing a callback function with the message from the Dispatcher.
- The Receiver sends a reply to the Dispatcher with a serialized message.