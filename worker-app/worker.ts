import { HashSumTask } from "../types/message.type.js";
import { HashSumTaskQueue } from "../utils/amqp/commonQueues/hashsum.task.queue.js";
import { HashSumTaskResultQueue } from "../utils/amqp/commonQueues/hashsum.task.result.queue.js";
import { WorkerPool } from "./threadsPool/pool.js";

async function main() {
  const pool = new WorkerPool(8);

  new HashSumTaskQueue()
    .withHandler(async (message: HashSumTask) => {
      const PID = process.pid;
      const found = await pool.acquire(message);

      if (found && typeof found === "string") {
        
        const result = {
          found,
          PID,
          foundAt: Date.now(),
          end: message.batchEnd,
          start: message.batchStart,
        };

        await new HashSumTaskResultQueue().publish(result);
      }
    })
    .consume();
}

main().catch((err) => console.error(err));
