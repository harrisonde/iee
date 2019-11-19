export abstract class AbstractHooks {

    /**
     * Register hooks into system.
     */
    static bind (): void {}

    /**
     * Hook caller by name.
     */
    static call(): void {}
    
    /**
     * Register a hook.
     */
    static register(): void {}
    
    /**
    * Boot hooks for usage by the system.
    */
    static boot(): void {}
}