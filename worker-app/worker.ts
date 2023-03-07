import { HashSumTaskQueue } from './queue/hashsum.task.queue.js';

async function main () {
    new HashSumTaskQueue().consume();
  }

main().catch(err => console.error(err))
