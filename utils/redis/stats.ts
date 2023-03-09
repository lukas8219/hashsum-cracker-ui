import ioredis, { Redis } from 'ioredis';
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

    private readonly client : Redis = redis;
    private readonly allUsedHashSums = new Set<string>();

    constructor(){
    }
    
    async assignWorker(hashSum : string, worker: string){
        this.allUsedHashSums.add(hashSum);
        return !!(await this.client.sadd(buildKey(hashSum), worker));
    }

    async removeWorker(hashSum: string, worker : string){
        this.allUsedHashSums.delete(hashSum);
        return !!(await this.client.srem(buildKey(hashSum), worker));
    }

    async stats(hashSum : string) {
        return this.client.smembers(buildKey(hashSum));
    }

    async allStats() : Promise<HashSumStats[]> {
        const objectAsString = await this.client.eval(script, 1, buildKey('*')) as string;
        return JSON.parse(objectAsString);
    }

    async cleanUpWorkers(threadIdentifiers : string[]){
        for(const hashSum of this.allUsedHashSums){
            await this.client.srem(buildKey(hashSum), threadIdentifiers);
        }
    }

}
export type HashSumStats = {
    totalVariations : number;
    currentBatch: number;
    totalWorkers: number;
    searchHash: string;
}