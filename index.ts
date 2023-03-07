import amqp, { ConsumeMessage } from 'amqplib'
import { QueueNames } from './commons/queues.js'
import { LoggerFactory } from './utils/logger/index.js'

const logger = LoggerFactory.newLogger('index.ts');
logger.info(`listening to ${QueueNames.RESULT}`);

async function main () {
  
  const connection = await amqp.connect('amqp://localhost')
  const channel = await connection.createChannel()
  const { queue } = await channel.assertQueue(QueueNames.RESULT)

  channel.consume(queue, async(msg : ConsumeMessage | null) => {
    if(!msg) return;
    logger.info(JSON.parse(msg.content.toString()));
    channel.ack(msg);
  })
}

main().catch(err => console.error(err))
