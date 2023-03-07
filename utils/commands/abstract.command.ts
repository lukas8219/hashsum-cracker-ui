import { LoggerFactory } from "../logger/index.js";
import queuePool from "../amqp/queue.pool.js";
import { QueueNames } from "../../commons/queues.js";

export default abstract class Command {

    private readonly logger = LoggerFactory.newLogger(this.constructor['name']);

    async dispatch() : Promise<void> {
        this.logger.info(`dispatching command`);
        const queue = await queuePool.get(this.queue);
        queue.publish(this._payload);
    }

    //Decide what to do.
    abstract validate() : void;
    abstract get queue() : QueueNames;

    private get _payload() : any {
        const payload : any = Object.entries(this).reduce((previous, [k,v]) => ({ ...previous, [k] : v}), {});
        delete payload['logger'];
        return payload;
    }
}