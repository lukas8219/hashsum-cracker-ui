import { StaticPool } from "node-worker-threads-pool";
import { HashSumTask } from "../../types/message.type.js";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { HashSumService } from "../../utils/redis/stats.js";
import { randomBytes } from "crypto";
import exitHook from 'async-exit-hook';

const SCRIPT_PATH = fileURLToPath(join(dirname(import.meta.url), './processTask.js'));

type HashSumFn = (hashSum : HashSumTask) => Promise<boolean | string>;

export class WorkerPool {

    private readonly pool : StaticPool<HashSumFn, any>;
    private readonly service = new HashSumService();
    private readonly hashIterator : Generator<string>;
    private readonly threadHashes : string[];

    constructor(private readonly size : number){
        this.pool = new StaticPool({ size, task: SCRIPT_PATH });
        this.hashIterator = this._hashIterator();
        this.threadHashes = Array.from({ length: this.size }).map(() => `${randomBytes(8).toString('hex')}:${process.pid}`);
        exitHook((done) => this.cleanUpWorkers(done))
    }

    async acquire(argument : HashSumTask){
        const worker = this.currentWorker;

        await this.service.assignWorker(argument.searchHash, worker);
        const result = await this.pool.exec(argument);
        await this.service.removeWorker(argument.searchHash, worker)

        return result;
    }

    private * _hashIterator(){
        //Should use consistent hash?
        
        let currentIndex = 0;
        while(true){
            yield this.threadHashes[currentIndex++ % this.size];
        }
    }

    private async cleanUpWorkers(cb : () => void){
        await this.service.cleanUpWorkers(this.threadHashes);
        cb();
    }

    private get currentWorker() : string {
        return this.hashIterator.next().value;
    }

}