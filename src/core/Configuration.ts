interface Configs {
    /**
     * The type of component to create
     */
    component: string;

    /**
     * Dispatcher origin consumed by the receiver where domain(s) are whitelisted. 
     */
    dispatcherOrigin: string;

    /**
     * Receiver origin consumed by the dispatcher where domain(s) are whitelisted.
     */
    receiverOrigin: string;

    /**
     * Build will maintain standard out logging events to the console.
     */
    silent: boolean;
    
}

interface Store {
    cache: object;
    hooks: object;
}


interface Get {
    /**
    * Get a configuration by its key.
    */
   (configurationKey: string): string;
}

interface List {
    /**
    * List ALL configuration options from the Store cache.
    */
    (): any;
}

interface Set {
    /**
    * Assign a given set of configuration options to the Store cache 
    */
    (configurationOptions): boolean;
}


export class Configuration {

    private configuration: Configs = {
        component: undefined,
        dispatcherOrigin: '*',
        receiverOrigin: '*',
        silent: false
    }

    private static store: Store = {
        cache: {},
        hooks: {}
    }

    constructor() {
        Configuration.store.cache = this.configuration
    }

    static getConfiguration: Get = (configurationKey?:string) => {
        console.log(configurationKey, Configuration.store.cache)
        if (configurationKey) return Configuration.store.cache[configurationKey]
        return {}
    }

    static listConfiguration: List = (vaultKey:string = 'cache') => {
        return Configuration.store[vaultKey]
    }

    static putConfiguration = (vault = 'cache', configuration) => {
        Object.assign(Configuration.store[vault], configuration)
    }

    setConfiguration: Set = (configurationOptions) => {
        try {
            Configuration.store.cache = Object.assign(Configuration.store.cache, configurationOptions)
            return true
        }catch(error){
            return error
        }
    }
}