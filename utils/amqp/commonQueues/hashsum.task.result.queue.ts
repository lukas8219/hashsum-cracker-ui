import { QueueNames } from "../../../commons/queues.js";
import { Queue } from "./abstract.queue.js";

export class HashSumTaskResultQueue extends Queue<any, any> {
    
    async handle(message: any): Promise<any> {
        console.log(message);
    }
    get name(): QueueNames {
       return QueueNames.RESULT;
    }

}