import { QueueNames } from "../../../commons/queues.js";
import { HashSumTask } from "../../../types/message.type.js";
import { Queue } from "./abstract.queue.js";

export class HashSumTaskQueue extends Queue<HashSumTask, any> {

    get name(): QueueNames {
        return QueueNames.TASK;
    }

}