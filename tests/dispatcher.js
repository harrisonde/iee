import { Kernel } from '../src/core/Kernel'
import { Dispatcher } from '../src/components/Dispatcher'
import { Configuration } from '../src/core/Configuration'

describe('The dispatcher component is well formed.', () => {

    const SystemKernel = new Kernel()
    SystemKernel.boot()
   

    const hooksConfiguration = Configuration.listConfiguration('hooks')

    // Now we may run our test
    // Boot
    test('Can be booted.', () => {
        expect(hooksConfiguration['dispatcher'].lineage[0]).toBe('boot')
    })

    // Register
    test('Can be registered into the system.', () => {
        expect(hooksConfiguration['dispatcher'].lineage).toStrictEqual(['boot', 'register'])
    })

    // New-up
    test('Can new-up.', () => {
        const dispatcher = new Dispatcher();
        expect(dispatcher).not.toBeUndefined()
        expect(hooksConfiguration['dispatcher'].lineage).toStrictEqual(['boot', 'register', 'ready'])
    })

    test('Has ability to send messages.', () => {
        const dispatcher = new Dispatcher();
        expect(dispatcher.message).not.toBeUndefined()
    })

    test('Obtain line of sight to the target.', () => {
        const dispatcher = new Dispatcher();
        expect(dispatcher.target.postMessage).toBeTruthy()
    })

    test('Can send communication to target.', () => {
        // Mute warning for this test.
        console.warn = jest.fn((warning) => {});
        const dispatcher = new Dispatcher();
        const payload = {
            event: 'confirm',
            message: 'Did you get my message?',
        }
        expect(dispatcher.message(payload)).toBeUndefined()
    })

    test('Receiver origin wildcard logs warning', () => { 
        console.warn = jest.fn();
        const dispatcher = new Dispatcher();
        const payload = {
            event: 'confirm',
            message: 'Did you get my message?',
        }
        dispatcher.message(payload)
        expect(console.warn.mock.calls.flat().pop()).toMatch(/[a-zA-Z0-9!]/);
        
    })
})