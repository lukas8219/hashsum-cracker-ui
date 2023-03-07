import { QueueNames } from "../../../commons/queues.js";
import HashSumCrackStartCommand from "../../commands/hashsum.crack.start.command.js";
import { Queue } from "./abstract.queue.js";
import { OmitFn } from "../types.js";

export class HashSumCrackStartQueue extends Queue<OmitFn<HashSumCrackStartCommand>, any> {
        
    get name(): QueueNames {
        return QueueNames.HASHSUM_CRACK_COMMAND;
    }


}