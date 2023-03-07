export interface AmqpClient {
    acknowledge :<T extends Message<T>>(message : Message<T>) => void;
    reject : <T extends Message<T>>(message : Message<T>) => void;
    createQueue : (name : string) => Queue;
}

export interface Queue {
    consume : <T extends Message<T>> (consumer : (message : Message<T>) => void) => void;
    publish: <T extends Message<T>> (message : T) => void;
}

export class QueueImp implements Queue {

    constructor(private readonly client : AmqpClient){};

    consume<T extends Message<T>>(consumer: (message: Message<T>) => void) {

    }

    publish<T extends Message<T>>(message: T) : void {

    }

}

interface Message <T> {
    content : T
    replyTo: string;
    correlationId: string;
}

export class QueueFactory {

    constructor(private readonly client : AmqpClient){}

    async createQueue(name : string) : Promise<Queue>{
        return this.client.createQueue(name);
    }

}

//AmqpManager -> INIT and DEAL WITH CONNECTION POOL
//QueueFactory - Creates queues and depends upon AmqpManager