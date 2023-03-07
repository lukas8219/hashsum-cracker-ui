import { QueueNames } from "../../commons/queues.js";
import { HashSumTask } from "../../types/message.type.js";
import { Queue } from "../../utils/amqp/commonQueues/abstract.queue.js";
import { HashSumTaskResultQueue } from "../../utils/amqp/commonQueues/hashsum.task.result.queue.js";
import { WorkerPool } from "../threadsPool/pool.js";

const pool = new WorkerPool(8);

export class HashSumTaskQueue extends Queue<HashSumTask, any> {

    async handle(message: HashSumTask): Promise<any> {
        const PID = process.pid;
        const found = await pool.acquire(message);

        if(found && typeof found === 'string'){
            const result = {
              found,
              PID,
              foundAt: Date.now(),
              end: message.batchEnd,
              start: message.batchStart,
            }
            await new HashSumTaskResultQueue().publish(result);
        }
    }

    get name(): QueueNames {
        return QueueNames.TASK;
    }

}