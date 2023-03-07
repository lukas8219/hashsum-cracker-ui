import { QueueNames } from "../../../commons/queues.js";
import { Queue } from "./abstract.queue.js";

export class HashSumTaskResultQueue extends Queue<any, any> {
    
    async handle(message: any): Promise<any> {
        throw new Error("Method not implemented.");
    }
    get name(): QueueNames {
        throw new Error("Method not implemented.");
    }

}