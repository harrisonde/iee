import { Kernel } from '../src/core/Kernel'
import { Receiver } from '../src/components/Receiver'
import { Configuration } from '../src/core/Configuration'

describe('The receiver component is well formed.', () => {

    // Boot 
    const SystemKernel = new Kernel()
    SystemKernel.boot()
    
    const hooksConfiguration = Configuration.listConfiguration('hooks')
    
    // Now we may run our test
    // Boot
    test('Can be booted.', () => {
        expect(hooksConfiguration['receiver'].lineage[0]).toBe('boot')
    })
    
    // Register
    test('Can be registered into the system.', () => {
        expect(hooksConfiguration['receiver'].lineage).toStrictEqual(['boot', 'register'])
    })
    
    // New-up
    test('Can new-up receiver.', () => {
        const receiver = new Receiver()
        expect(receiver).not.toBeUndefined()
        expect(hooksConfiguration['receiver'].lineage).toStrictEqual(['boot','register', 'ready'])
    })


    test('Has ability to handel messages.', () => {
        const receiver = new Receiver()
        expect(receiver.handler).not.toBeUndefined()
    })

    test('Obtain line of sight to the target.', () => {
        const receiver = new Receiver()
        expect(receiver.target).toBeTruthy()
    })

    test('Can receive communication from target.', () => {
        // Mock 
        // Mute warning for this test by mocking console.
        console.warn = jest.fn();
        const mockEvent = {
            origin: "*",
            data: {
                event: 'confirm',
                message: 'Did you get my message?',
            }
        }

        const receiver = new Receiver()
        receiver.handler(mockEvent)        
        expect(console.warn.mock.calls.flat().pop().toString()).toMatch(mockEvent.toString());
    })

    test('Missing exact dispatcher origin logs warning.', () => {
        // Mock 
        // Mute warning for this test by mocking console.
        console.warn = jest.fn();
        global.dispatchEvent = jest.fn()

        const mockEvent = {
            origin: "*",
            data: {
                event: 'confirm',
                message: 'Did you get my message?',
            }
        }

        const receiver = new Receiver()
        receiver.handler(mockEvent)        
    
        const Event = global.dispatchEvent.mock.calls.flat().pop()
        expect(Event.messageEvent.data.event).toMatch(mockEvent.data.event);
        expect(Event.messageEvent.data.message).toMatch(mockEvent.data.message);
        
    })
})