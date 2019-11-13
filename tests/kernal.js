import { Kernel }  from '../src/core/Kernel.ts'
import { Configuration } from '../src/core/Configuration'

describe('The kernel properly boots', () => {
    
    const SystemKernel = new Kernel()

    test('A new kernel can be created.', () => {
        expect(SystemKernel).not.toBeUndefined()
    })

    test('System default configuration is properly applied.', () => {
        SystemKernel.boot()
        expect(SystemKernel.listSystemConfiguration()).toMatchObject(Configuration.listConfiguration())
    })

    test('Kernel ran system created hook.', () => {
        expect(Kernel.listConfiguration('hooks').created.lifecycle).toBe(true) 
    })

    test('Kernel ran system mounted hook.', () => {
        expect(Kernel.listConfiguration('hooks').mounted.lifecycle).toBe(true)
    })
    
})
