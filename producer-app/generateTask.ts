import { HashSumTask } from "../types/message.type.js";
import { LoggerFactory } from "../utils/logger/index.js";
import { Store } from "../utils/redis/client.js";

export class HashSumTaskGenerator {

  private readonly LOGGER = LoggerFactory.newLogger('HashSumTaskGenerator');

  constructor(
    private readonly searchHash : string,
    private readonly alphabet : string,
    private readonly maxWordLength : number,
    private readonly batchSize : number
  ){}

  async *[Symbol.asyncIterator]() : AsyncGenerator<HashSumTask, void, void> {

    this.LOGGER.info(JSON.stringify(this));

    let nVariations = 0
    for (let n = 1; n <= this.maxWordLength; n++) {
      nVariations += Math.pow(this.alphabet.length, n)
    }
  
    this.LOGGER.info('Finding the hashsum source string over ' +
    `${nVariations} possible variations`)
  
    let batchStart = 1
    let count = 0;
    

    //TODO maybe create a Redis logic to fetch the below objects.
    //fetch, Check if canceled
    //If not canceled, proccess job.
    //If canceled, bail out and remove key from Redis.

    while (batchStart <= nVariations && !(await Store.isCanceled(this.searchHash))) {
      const batchEnd = Math.min(
        batchStart + this.batchSize - 1, nVariations)
      yield {
        searchHash: this.searchHash,
        alphabet: this.alphabet,
        alphabetIndex: ++count % this.alphabet.length,
        batchStart,
        batchEnd
      }
      batchStart = batchEnd + 1
    }
  }

}