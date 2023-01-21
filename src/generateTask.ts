import { LoggerFactory } from "../utils/logger"
import { HashSumTask } from "../types/message.type";

const logger = LoggerFactory.newLogger('task-generator');

export function * generateTasks (searchHash : string, alphabet : string,
  maxWordLength : number, batchSize: number) : Generator<HashSumTask, void, void> {
  let nVariations = 0
  for (let n = 1; n <= maxWordLength; n++) {
    nVariations += Math.pow(alphabet.length, n)
  }

  logger.info('Finding the hashsum source string over ' +
  `${nVariations} possible variations`)

  let batchStart = 1
  let count = 0;
  while (batchStart <= nVariations) {
    const batchEnd = Math.min(
      batchStart + batchSize - 1, nVariations)
    yield {
      searchHash,
      alphabet,
      alphabetIndex: ++count % alphabet.length,
      batchStart,
      batchEnd
    }
    batchStart = batchEnd + 1
  }
}
