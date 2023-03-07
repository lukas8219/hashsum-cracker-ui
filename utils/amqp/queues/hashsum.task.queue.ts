import { QueueNames } from "../../../commons/queues.js";
import { HashSumTask } from "../../../types/message.type.js";
import { Queue } from "./abstract.queue.js";

export class HashSumTaskQueue extends Queue<HashSumTask, any> {

    handle(message: HashSumTask): Promise<any> {
        throw new Error("Method not implemented.");
    }
    get name(): QueueNames {
        throw new Error("Method not implemented.");
    }

}