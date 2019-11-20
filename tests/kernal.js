import { Kernel }  from '../src/core/Kernel.ts'
import { Configuration } from '../src/core/Configuration'

describe('The kernel properly boots', () => {
    
    const SystemKernel = new Kernel()

    test('A new kernel can be created.', () => {
        expect(SystemKernel).not.toBeUndefined()
    })

    test('System default configuration is properly applied.', () => {
        SystemKernel.boot()
        expect(Kernel.listConfiguration()).toMatchObject(Configuration.listConfiguration())
    })

    test('Kernel ran system created hook.', () => {
        expect(Kernel.listConfiguration('hooks').created.lifecycle).toBe(true) 
    })

    test('Kernel ran system mounted hook.', () => {
        expect(Kernel.listConfiguration('hooks').mounted.lifecycle).toBe(true)
    })

    test('Kernel ran dispatcher hook.', () => {
        expect(Kernel.listConfiguration('hooks').dispatcher.lineage).toStrictEqual(['boot','register'])
    })

    test('Kernel ran receiver hook.', () => {
        expect(Kernel.listConfiguration('hooks').receiver.lineage).toStrictEqual(['boot', 'register'])
    })
    
})
 