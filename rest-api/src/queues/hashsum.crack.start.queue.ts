import { QueueNames } from "../../../commons/queues.js";
import HashSumCrackStartCommand from "../../../utils/commands/hashsum.crack.start.command.js";
import { Queue } from "../../../utils/amqp/commonQueues/abstract.queue.js";
import { OmitFn } from "../../../utils/amqp/types.js";

export class HashSumCrackStartQueue extends Queue<OmitFn<HashSumCrackStartCommand>, any> {
    
    async handle(message: OmitFn<HashSumCrackStartCommand>): Promise<any> {
    }
    get name(): QueueNames {
        return QueueNames.HASHSUM_CRACK_COMMAND;
    }


}