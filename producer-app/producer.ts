import amqp from 'amqplib'
import { HashSumTaskGenerator } from './generateTask.js'
import { LoggerFactory } from '../utils/logger/index.js'
import { QueueNames } from '../commons/queues.js';

const logger = LoggerFactory.newLogger('producer-app');

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz'
const BATCH_SIZE = 100;

const [, , maxLength = 4, searchHash = 'c80f5bc166cd6739ba9ba6d94acabc0aa01494da' ] = process.argv

async function main () {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createConfirmChannel();
  const { queue } = await channel.assertQueue(QueueNames.TASK,  { durable: true });

  for await (const task of new HashSumTaskGenerator(searchHash, ALPHABET, Number(maxLength), BATCH_SIZE)) {
    logger.info({ searchHash: task.searchHash }, 'posting message to', { queueName: QueueNames.TASK, replyTo: QueueNames.RESULT });
    await channel.sendToQueue(queue, Buffer.from(JSON.stringify(task)), { replyTo: QueueNames.RESULT });
  }

  await channel.waitForConfirms()
  await channel.close()
  connection.close()
}

main().catch(err => console.error(err))