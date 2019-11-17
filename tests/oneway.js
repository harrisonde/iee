beforeAll(() => {
    // Mocks
    //console.warn = jest.fn();
})

describe('The framework can communicate across origin; one-way messaging.', () => {

    // Setup 
    const Rivet = require('../src/core/index').default
    const rivet = new Rivet()

    //console.log(rivet)
    
    // TODO
    // Current example creates two isolated apps and should really be one call to IEE,
    // with two sub new-ups to internal components. 


    // Add Components
    // New-up an instance dispatcher
    const dispatcher =  new rivet.dispatcher();

    // New-up an instance receiver
    const receiver = new rivet.receiver();

    //console.log(dispatcher, receiver)
    
    // test('Dispatcher sends and Receiver accepts a message.',  (done) => {
        
    //     // Dispatch s single message
    //     const eventToBeEmitted = {
    //           event: 'confirm',
    //           message: 'Did you get my message?',
    //     }
        
    //     receiver.listen('confirm', function (event) {
    //         expect(event.message).toBe(eventToBeEmitted.message)
    //         expect(event.event).toBe(eventToBeEmitted.event)    
    //         done()      
    //     });

    //     dispatcher.message(eventToBeEmitted)


    // })


    test('Receiver can reply to authorized message.', (done) => {

        // Dispatch s single message
        const eventToBeEmitted = {
            event: 'confirm',
            message: 'Did you get my message?',
        }

        function reply(response, event) {
            receiver.message(response, event)
        }

        receiver.listen('confirm', function (event) {
            
            console.log('reciever listen', event)
            
            reply({
               event: 'response',
               message: 'Yes.',
            })
        });

        
        dispatcher.listen('response', function (event) {
            //expect(event.message).toBe(eventToBeEmitted.message)
            //expect(event.event).toBe(eventToBeEmitted.event)
            //done()
            
            console.log('dispatcher.listen', event)

            done()
        })

        dispatcher.message(eventToBeEmitted)
    })
})