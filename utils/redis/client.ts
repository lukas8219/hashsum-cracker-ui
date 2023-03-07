import ioredis from 'ioredis'

//@ts-ignore
const redisClient = ioredis.createClient();

class HashSumStore {

    async isCanceled(hashSum : string) : Promise<boolean> {
        return await redisClient.getex(this._buildKey(hashSum), 'EX', 10) === '1';
    }

    async cancel(hashSum : string) : Promise<boolean> {
        const result = await redisClient.set(this._buildKey(hashSum), 1)
        return result === 'OK';
    }

    private _buildKey(hashSum : string) : string{
        return `hashsum:${hashSum}`;
    }

}

const Store = new HashSumStore();

export { redisClient, Store, HashSumStore };

