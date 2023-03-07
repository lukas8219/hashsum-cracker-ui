import { HashSumTaskResultQueue } from './utils/amqp/commonQueues/hashsum.task.result.queue.js';
import { LoggerFactory } from './utils/logger/index.js'

const logger = LoggerFactory.newLogger('index.ts');

async function main () {
  const queue = new HashSumTaskResultQueue();
  queue.consume();
  logger.info(`listening to ${queue.name}`);
}

main().catch(err => console.error(err))
