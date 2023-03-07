import amqp, { Channel, Message, Replies, Options, Connection } from 'amqplib';
import { Readable } from 'stream';

type ArrayOfPromises<T> =  (() => Promise<T>)[]

export class AmqpClient {

    private connection : Connection | undefined;
    private channel : Channel | undefined;
    private _isReady : boolean = false;

    private _delayedPromises : ArrayOfPromises<any> = [];

    constructor(){
        this._connect();
    }

    private async _connect() : Promise<void> {
        this.connection = await amqp.connect(`amqp://localhost`);
        this.channel = await this.connection.createChannel();
        this.channel.prefetch(1);
        this._isReady = true;
        await this._processAllDelayedPromises();
    }

    private async _processAllDelayedPromises() {
        for await(const promise of Readable.from(this._delayedPromises)){
            await promise();
        }
    }

    async acknowledge<T>(message : Message) : Promise<void> {
        if(!this._isReady || !this.channel){
            return new Promise((res) => {
                this._delayedPromises.push(async () => res(this.acknowledge(message)));
            })
        }
        return this.channel.ack(message);
    }

    async reject(message : Message) : Promise<void> {
        if(!this._isReady || !this.channel){
            return new Promise((res) => {
                this._delayedPromises.push(async () => res(this.reject(message)));
            })
        }

        return this.channel.nack(message);
    }

    async consume(queueName : string, consumer : (message : Message | null) => void) : Promise<Replies.Consume> {
        if(!this._isReady || !this.channel){
            return new Promise((res) => {
                this._delayedPromises.push(async () => res(this.consume(queueName, consumer)));
            })
        }
        const { queue } = await this.assertQueue(queueName);
        return this.channel.consume(queue, consumer);
    }

    async publish(queueName : string, message : Buffer) : Promise<boolean> {
        if(!this._isReady || !this.channel){
            return new Promise((res) => {
                this._delayedPromises.push(async () => res(this.publish(queueName, message)));
            })
        }
        const { queue } = await this.assertQueue(queueName);
        return this.channel.sendToQueue(queue, message);
    }

    private assertQueue(queueName : string, opts : Options.AssertQueue = {}) : Promise<Replies.AssertQueue>{
        if(!this._isReady || !this.channel){
            return new Promise((res) => {
                this._delayedPromises.push(async () => res(this.assertQueue(queueName, opts)));
            })
        }
        return this.channel.assertQueue(queueName, opts)
    }
}
