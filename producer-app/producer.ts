import amqp from 'amqplib'
import { HashSumTaskGenerator } from './generateTask.js'
import { LoggerFactory } from '../utils/logger/index.js'
import { QueueNames } from '../commons/queues.js';
import { HashSumTaskQueue } from '../utils/amqp/commonQueues/hashsum.task.queue.js';
import { HashSumCrackStartQueue } from '../utils/amqp/commonQueues/hashsum.crack.start.queue.js';

const logger = LoggerFactory.newLogger('producer-app');

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz'
const BATCH_SIZE = 100;

async function main () {
  const queue = new HashSumTaskQueue();
  const commandQueue = new HashSumCrackStartQueue()

  commandQueue.withHandler(async (message) => {
    for await (const task of new HashSumTaskGenerator(message.searchHash, ALPHABET, Number(message.maxLength), BATCH_SIZE)) {
      logger.info({ searchHash: task.searchHash }, 'posting message to', { queueName: QueueNames.TASK, replyTo: QueueNames.RESULT });
      await queue.publish({ ...task, replyTo: QueueNames.RESULT });
    }
  })
  .consume();

}

main().catch(err => console.error(err))