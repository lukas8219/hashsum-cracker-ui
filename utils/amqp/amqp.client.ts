import { Channel, Message, Replies, Options } from 'amqplib';

export class AmqpClient {

    constructor(private readonly channel : Channel){}

    acknowledge<T>(message : Message) :void {
        return this.channel.ack(message);
    }
    reject<T>(message : Message) : void {
        return this.channel.nack(message);
    }

    async consume<T> (queueName : string, consumer : (message : Message | null) => void) : Promise<Replies.Consume> {
        const { queue } = await this.assertQueue(queueName);
        return this.channel.consume(queue, consumer);
    }

    async publish<T> (queueName : string, message : Buffer) : Promise<boolean> {
        const { queue } = await this.assertQueue(queueName);
        return this.channel.sendToQueue(queue, message);
    }

    assertQueue(queueName : string, opts : Options.AssertQueue = {}) : Promise<Replies.AssertQueue>{
        return this.channel.assertQueue(queueName, opts)
    }
}