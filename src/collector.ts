import amqp from 'amqplib'
import { LoggerFactory } from '../utils/logger'

const logger = LoggerFactory.newLogger('collector');

async function main () {
  const connection = await amqp.connect('amqp://localhost')
  const channel = await connection.createChannel()
  const { queue } = await channel.assertQueue('results_queue')
  channel.consume(queue, async(msg : any) => {
    logger.info(`Message from worker: ${msg.content.toString()}`)
    channel.ack(msg);
  })
}

main().catch(err => logger.error(err))
