import amqp from 'amqplib'
import { generateTasks } from './generateTask'

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz'
const BATCH_SIZE = 10000

const [, , maxLength, searchHash] = process.argv

async function main () {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createConfirmChannel();
  const { queue } = await channel.assertQueue(`tasks_queue`);

  const generatorObj = generateTasks(searchHash, ALPHABET, Number(maxLength), BATCH_SIZE);

  for await (const task of generatorObj) {
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(task)));
  }

  channel.waitForConfirms()
  channel.close()
  connection.close()
}

main().catch(err => console.error(err))
