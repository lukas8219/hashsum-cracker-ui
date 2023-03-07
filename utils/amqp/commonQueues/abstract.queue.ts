import { QueueNames } from "../../../commons/queues.js";
import { AmqpClient } from "../amqp.client.js";
import { Message } from "../types.js";
import { Message as amqpMessage } from "amqplib";
import { LoggerFactory } from "../../logger/index.js";

export abstract class Queue<REQ,RES> {

    //TODO improve how we log things.
    private readonly logger = LoggerFactory.newLogger(`Queue`);
    private readonly client : AmqpClient;

    constructor(){
        this.client = new AmqpClient();
    }

    consume() {
        return this.client.consume(this.name, async (message : amqpMessage | null) => {
            this.logger.info(`received messaged for ${this.name}`)
           if(!message) return;
           try {
            const parsedMessage = this.amqpToMessage(message);
            await this.handle(parsedMessage.content);
            if(parsedMessage.replyTo){
             //send to ReplyTo queue.
            }
            this.client.acknowledge(message);
           } catch(err){
            
           }
           
        });
    }

    async publish(message: REQ) : Promise<boolean> {
        if(message instanceof Buffer){
            return this.client.publish(this.name, message);
        };
        return this.client.publish(this.name, Buffer.from(JSON.stringify(message)));        
    }

    private amqpToMessage(rawMessage : amqpMessage) : Message<REQ> {
        //TODO Maybe add validator middleware?
        const content = JSON.parse(rawMessage.content.toString());
        return {
            content,
            replyTo: rawMessage.properties.replyTo,
            correlationId: rawMessage.properties.correlationId,
        }
    }

    abstract handle(message : REQ) : Promise<RES>;

    abstract get name(): QueueNames;

}