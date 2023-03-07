import amqp, { ConsumeMessage } from 'amqplib'
import { QueueNames } from '../commons/queues.js';
import { HashSumTask } from '../types/message.type.js';
import { WorkerPool } from './threadsPool/pool.js';

const pool = new WorkerPool(8);

async function main () {
  const PID = process.pid;
  const connection = await amqp.connect('amqp://localhost')
  const channel = await connection.createChannel()
  
  const { queue: taskQueue } = await channel.assertQueue(QueueNames.TASK)
  const { queue: resultQueue } = await channel.assertQueue(QueueNames.RESULT);

  await channel.prefetch(8);

  channel.consume(taskQueue, async (rawMessage : ConsumeMessage | null) => {
    if(!rawMessage) return;
    const parsedMessage : HashSumTask = JSON.parse(rawMessage.content.toString());
    const found = await pool.acquire(parsedMessage);

    if(found && typeof found === 'string'){
      const result = {
        found,
        PID,
        foundAt: Date.now(),
        end: parsedMessage.batchEnd,
        start: parsedMessage.batchStart,
      }
      channel.sendToQueue(resultQueue, Buffer.from(JSON.stringify(result)));
    }

    channel.ack(rawMessage)
  })
  }

main().catch(err => console.error(err))
