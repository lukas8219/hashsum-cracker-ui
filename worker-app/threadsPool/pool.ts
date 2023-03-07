import { StaticPool } from "node-worker-threads-pool";
import { HashSumTask } from "../../types/message.type.js";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const SCRIPT_PATH = fileURLToPath(join(dirname(import.meta.url), './processTask.js'));

type HashSumFn = (hashSum : HashSumTask) => Promise<boolean | string>;

export class WorkerPool {

    private readonly pool : StaticPool<HashSumFn, any>;

    constructor(size : number){
        this.pool = new StaticPool({ size, task: SCRIPT_PATH });
    }

    acquire(argument : HashSumTask){
        return this.pool.exec(argument);
    }

}