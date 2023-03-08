import ioredis from 'ioredis';
import { hostname  } from 'os';

//@ts-ignore
const redis = ioredis.createClient();

function buildKey(hashSum : string){
    return `v1:workers:${hashSum}`;
}

const script = `
local split_fn = function (inputstr)
    local t={}
    for str in string.gmatch(inputstr, \"([^:]+)\") do
            table.insert(t, str)
    end
    return t;
end

local cursor = 0;
local dict = {};

repeat
    local result = redis.call('SCAN', cursor, 'MATCH', KEYS[1], 'COUNT', 1);
    cursor = result[1];
    for _, v in ipairs(result[2]) do
  		local scard_result = redis.call('SCARD', v);
		local hashSum = split_fn(v)[3]
		dict[hashSum] = scard_result;
	end
until cursor == '0';
return cjson.encode(dict);
`

export class HashSumService {

    private readonly client = redis;
    private readonly allUsedHashSums = new Set<string>();

    constructor(){
        this.listenToExitEvents();
    }
    
    async assignWorker(hashSum : string){
        this.allUsedHashSums.add(hashSum);
        return !!(await this.client.sadd(buildKey(hashSum), this.worker));
    }

    async removeWorker(hashSum: string){
        this.allUsedHashSums.delete(hashSum);
        return !!(await this.client.srem(buildKey(hashSum), this.worker));
    }

    async stats(hashSum : string) {
        return this.client.smembers(buildKey(hashSum));
    }

    async allStats() : Promise<HashSumStats[]> {
        const objectAsString = await this.client.eval(script, 1, buildKey('*')) as string;
        return JSON.parse(objectAsString);
    }

    private cleanUpWorkers() : void {
        console.log(`heyyyy`);
        for(const hashSum of this.allUsedHashSums){
            this.client.srem(buildKey(hashSum), this.worker);
        }
    }

    private listenToExitEvents(){
        [`exit`, `SIGINT`, `SIGUSR1`, `SIGUSR2`, `uncaughtException`, `SIGTERM`].forEach((eventType) => {
            process.on(eventType, this.cleanUpWorkers.bind(this));
          })
    }

    private get worker() : WorkerId {
        return `${hostname()}:${process.pid}`
    }



}

type Host = string;
type PID = number;
export type WorkerId = `${Host}:${PID}`


export type HashSumStats = {
    totalVariations : number;
    currentBatch: number;
    totalWorkers: number;
    searchHash: string;
}