import { LoggerFactory } from "../utils/logger"

const logger = LoggerFactory.newLogger('task-generator');

export function * generateTasks (searchHash : string, alphabet : string,
  maxWordLength : number, batchSize: number) {
  let nVariations = 0
  for (let n = 1; n <= maxWordLength; n++) {
    nVariations += Math.pow(alphabet.length, n)
  }

  logger.info('Finding the hashsum source string over ' +
  `${nVariations} possible variations`)

  let batchStart = 1
  while (batchStart <= nVariations) {
    const batchEnd = Math.min(
      batchStart + batchSize - 1, nVariations)
    yield {
      searchHash,
      alphabet: alphabet,
      batchStart,
      batchEnd
    }

    batchStart = batchEnd + 1
  }
}
