import amqp from 'amqplib'
import { generateTasks } from './generateTask'
import { LoggerFactory } from '../utils/logger'

const logger = LoggerFactory.newLogger('producer-app');

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz'
const BATCH_SIZE = 10000

const [, , maxLength, searchHash ] = process.argv

async function main () {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createConfirmChannel();
  const { exchange } = await channel.assertExchange('worker_exchange', 'direct', { durable: true });

  for await (const task of generateTasks(searchHash, ALPHABET, Number(maxLength), BATCH_SIZE)) {
    const routingKey = `worker.${task.alphabetIndex}`;
    logger.info({ routingKey, searchHash: task.searchHash }, 'posting message');
    channel.publish(exchange, routingKey, Buffer.from(JSON.stringify(task)));
  }

  channel.waitForConfirms()
  channel.close()
  connection.close()
}

main().catch(err => console.error(err))