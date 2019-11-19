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

     /**
     * Always specify an exact target origin to mitigate XSS attack vector.
     */
    warningOrigin: boolean;
}

interface Store {
    cache: object;
    hooks: object;
}


interface Get {
    /**
    * Get a configuration by its key.
    */
    (configurationKey: string): object;
}

interface List {
    /**
    * List ALL configuration options from the Store cache.
    */
    (): object | [] | string;
}

interface Set {
    /**
    * Assign a given set of configuration options to the Store cache 
    */
    (configurationOptions): boolean | Error;
}


export class Configuration {

    private configuration: Configs = {
        component: undefined,
        dispatcherOrigin: '*',
        receiverOrigin: '*',
        silent: false,
        warningOrigin: true
    }

    private static store: Store = {
        cache: {},
        hooks: {}
    }

    constructor() {
        Configuration.store.cache = this.configuration
    }

    static getConfiguration: Get = (configurationKey?: string): object => {
        if (configurationKey) return Configuration.store.cache[configurationKey]
        return {}
    }

    static listConfiguration: List = (vaultKey = 'cache'): object | [] | string => {
        return Configuration.store[vaultKey]
    }

    static putConfiguration = (vault = 'cache', configuration): void => {
        Object.assign(Configuration.store[vault], configuration)
    }

    setConfiguration: Set = (configurationOptions): boolean | Error => {
        try {
            Configuration.store.cache = Object.assign(Configuration.store.cache, configurationOptions)
            return true
        }catch(error){
            return error
        }
    }
}