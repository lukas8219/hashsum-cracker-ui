import isv from 'indexed-string-variation'
import { createHash } from 'crypto'
import { LoggerFactory } from '../utils/logger';
import { HashSumTask } from '../types/message.type';

const logger = LoggerFactory.newLogger('process-task');

export async function processTask (task : HashSumTask) {
  const variationGen = isv.generator(task.alphabet)
  logger.info('Processing from ' +
    `${variationGen(task.batchStart)} (${task.batchStart}) ` +
    `to ${variationGen(task.batchEnd)} (${task.batchEnd})`);

  let canceled = false;

  function cancel (){
    canceled = true;
  }

  async function tryToMatchShaSum(index : number){
    const word = variationGen(index)
    const shasum = createHash('sha1')
    shasum.update(word)
    return { word, digest: shasum.digest('hex') }
  }

  const process = async () => {
    for (let idx = task.batchStart; idx <= task.batchEnd; idx++) {
      if(canceled){
        return;
      }
     const { digest , word } = await tryToMatchShaSum(idx);

      if (digest === task.searchHash) {
        return word
      }
    }
  }

 return {
    cancel,
    process
  } 
}


