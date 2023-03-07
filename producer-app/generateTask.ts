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
    let nVariations = 0
    for (let n = 1; n <= this.maxWordLength; n++) {
      nVariations += Math.pow(this.alphabet.length, n)
    }
  
    this.LOGGER.info('Finding the hashsum source string over ' +
    `${nVariations} possible variations`)
  
    let batchStart = 1
    let count = 0;
    
    //TODO improve this write logic.
    //maybe use divide and conquer strategy.
    //Divide in 4 parts and iterate over all.
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