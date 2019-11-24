import { ComponentBase } from './ComponentBase';

export class Receiver extends ComponentBase{

    constructor(){
        super('receiver')
    }
    
    static boot = (): void => { 
        ComponentBase.boot('receiver')
    }
}