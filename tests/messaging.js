beforeAll(() => {
    // Mocks
    console.warn = jest.fn();
})

describe('The framework can communicate across origin; transparent bidirectional communication.', () => {

    // Setup 
    const Rivet = require('../src/core/index').default
    const rivet = new Rivet()

    // Add Components
    // New-up an instance dispatcher
    const dispatcher =  new rivet.dispatcher();

    // New-up an instance receiver
    const receiver = new rivet.receiver();

    
    test('Dispatcher sends and Receiver accepts a message.',  (done) => {
        
        // Dispatch s single message
        const eventToBeEmitted = {
              event: 'confirm',
              message: 'Did you get my message?',
        }
        
        receiver.listen('confirm', function (event) {
            expect(event.messageEvent.data.message).toBe(eventToBeEmitted.message)
            expect(event.messageEvent.data.event).toBe(eventToBeEmitted.event)    
            done()      
        });

        dispatcher.message(eventToBeEmitted)
    })


    test('Receiver can reply to authorized message from the dispatcher.', (done) => {

        const eventToBeEmitted = {
            event: 'confirm',
            message: 'Did you get my message?',
        }

        const eventToBeReceived = {
            event: 'response',
            message: 'Yes.',
        }

        function reply(response, event) {
            receiver.message(response, event)
        }

        receiver.listen('confirm', function (event) {
            reply(eventToBeReceived)
        });
        
        dispatcher.listen('response', function (event) {
            expect(event.messageEvent.data.message.toString()).toBe(eventToBeReceived.message)
            expect(event.messageEvent.data.event.toString()).toBe(eventToBeReceived.event)
            done()
        })

        dispatcher.message(eventToBeEmitted)
    })
})