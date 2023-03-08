import { generator } from "indexed-string-variation";
import { createHash } from "crypto";
import { LoggerFactory } from "../../utils/logger/index.js";
import { HashSumTask } from "../../types/message.type.js";
import { Store } from "../../utils/redis/client.js";
import { parentPort } from "worker_threads";
import { HashSumService } from "../../utils/redis/stats.js";

const logger = LoggerFactory.newLogger("process-task");
const hashSumService = new HashSumService()

async function processTask(task: HashSumTask) {
  const variationGen = generator(task.alphabet);
  logger.info(
    "Processing from " +
      `${variationGen(task.batchStart)} (${task.batchStart}) ` +
      `to ${variationGen(task.batchEnd)} (${task.batchEnd})`
  );

  async function tryToMatchShaSum(index: number) {
    const word : string = variationGen(index);
    const shasum = createHash("sha1");
    shasum.update(word);
    return { word, digest: shasum.digest("hex") };
  }

  const processFn = async (): Promise<boolean | string> => {
    
    for (let idx = task.batchStart; idx <= task.batchEnd; idx++) {
      if (await Store.isCanceled(task.searchHash)) {
        logger.info(`operation cancelled or finished`);
        return true;
      }
      const { digest, word } = await tryToMatchShaSum(idx);
      if (digest === task.searchHash) {
        await Store.cancel(task.searchHash);
        return word;
      }
    }
    return false;
  };

  const processFnWrapper = async () => {
    //Find a way to remove worker from Redis when dead
    //This script is running inside a worker thread. assiging process.on will not work.
    await hashSumService.assignWorker(task.searchHash);
    const found = await processFn();
    await hashSumService.removeWorker(task.searchHash);
    return found;
  }

  return {
    process: processFnWrapper,
  };
}


parentPort?.on('message', async (hashSum : HashSumTask) => {
  const { process } = await processTask(hashSum);
  parentPort?.postMessage(await process());
})

parentPort?.on('close', () => console.log(`closing worker thread`));