import { QueueNames } from "../../commons/queues.js";
import { Queue } from "./commonQueues/abstract.queue.js";
import { HashSumCrackStartQueue } from "./commonQueues/hashsum.crack.start.queue.js";
import { HashSumTaskQueue } from "./commonQueues/hashsum.task.queue.js";
import { HashSumTaskResultQueue } from "./commonQueues/hashsum.task.result.queue.js";

class QueuePool {

    private readonly POOL : Record<QueueNames, Queue<any, any>> = {
        [QueueNames.HASHSUM_CRACK_COMMAND]: new HashSumCrackStartQueue(),
        [QueueNames.RESULT]: new HashSumTaskResultQueue(),
        [QueueNames.TASK]: new HashSumTaskQueue()
    }

    async get(name : QueueNames) {
        return this.POOL[name];
    }

}

export default new QueuePool();