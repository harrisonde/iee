import { Kernel } from './Kernel'
import { Dispatcher } from '../components/Dispatcher'
import { Receiver } from '../components/Receiver'

const SystemKernel = new Kernel()

export default function Rivet (options): void {    

    SystemKernel.boot(options)

    this.dispatcher = Dispatcher

    this.receiver = Receiver

}