export abstract class AbstractComponentBase {

    /**
    * Reference to the window that will receive the message. Can be used
    * to verify the sender's identity and source properties. 
    */
    target 

    /**
     * The recipient's target origin where messages will be received. Used to
     * confirm the identity of the receiver.
     */
    targetOrigin: string

    /**
     * Display configuration waring in console; origin "*" exposes your application
     * to a XSS attack vector; inform the developer about the security risk.
     */
     warningOrigin: string

    /**
    * Whitelist of supported types received.
    */
    supported_message_types: string[]
    
    /**
    * When a message event is delivered to a target, establish a listener ready
    * to hear and handle said event.   
    */
    abstract bind(): void
    
    /**
     * Emits communication to a known target in scope. 
     */
    abstract emit(type: string, message: object)

    /**
     * The message event handler method called when a message is delivered between
     * two targets.
     */
    abstract handler(event)

    /**
     * Sends cross-origin communication between two targets.
     */
    abstract message(payload: object, event: Event)

    /*
     * Listen for messages from expected targets by event name. The internal callback 
     * is invoked on communication delivery.
     */
    abstract listen(eventType: string, callback: Function  ) 
    
    /**
    * Validate the shape of the received message by type event.
    */
    abstract isSupported(event)

    /**
    * Verify the sender's identity by origin of the event. Only after trust is establish 
    * may communication commence.
    */
    abstract trusted(origin: string)
}