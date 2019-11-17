# Introduction
Rivet is a zero-dependency module that fasten separate domains to establish transparent bidirectional communication across origins.

## Documentation
### Usage
One-way messaging between privileged and non-privileged pages:
```js
    const Rivet = require('@cidekar/rivet')

    // New-up an instance if rivet 
    const rivet = new Rivet()
    
    
    const dispatcher = new rivet.dispatcher();

    // New-up an instance receiver
    const receiver = new rivet.receiver();

    // Dispatch s single message
    dispatcher.message({
        event: 'confirm', 
        message: 'Did you get my message?',
    });

    // Receive a message
    receiver.listen('confirm', function(event){
        //... Handle message 
    });

```

## API

| Hooks          | Description   | 
| -------------  | ------------- |
| Created        |               |
| Mounted        |               |

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

## Life Cycle
- Receiver setup to listen for event be a given string name and associated callback; addEventListener
- Dispatcher sends event to a Receiver with an event payload and origin; postMessage API
- Receiver 