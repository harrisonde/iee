export abstract class AbstractHooks {

    /**
     * Register hooks into system.
     */
    ///abstract bind(): void
    static bind () {}

    /**
     * Hook caller by name.
     */
    //abstract call(name, args): void
    static call () {}
    
    /**
     * Register a hook.
     */
    //abstract register(name: string, callback, lifeCycle): void
    static register () {}
    
    /**
    * List hooks registered into system.
    */
    //abstract list(name: string):[]
    static list () {}
    
    /**
    * Boot hooks for usage by the system.
    */
    //abstract boot(): void
    static boot() { }

    /**
    * Track hooks while creating.
    */
    //abstract create()
    static create () { }

    /**
    * Track global hooks while mounting.
    */
    //abstract mounted()
    static mounted() { }
    
}