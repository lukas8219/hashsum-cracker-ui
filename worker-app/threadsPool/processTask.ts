import { generator } from "indexed-string-variation";
import { createHash } from "crypto";
import { LoggerFactory } from "../../utils/logger/index.js";
import { HashSumTask } from "../../types/message.type.js";
import { Store } from "../../utils/redis/client.js";
import { parentPort } from "worker_threads";

const logger = LoggerFactory.newLogger("process-task");

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

  return {
    process: processFn,
  };
}


parentPort?.on('message', async (hashSum : HashSumTask) => {
  const { process: processFn } = await processTask(hashSum);
  parentPort?.postMessage(await processFn());
})