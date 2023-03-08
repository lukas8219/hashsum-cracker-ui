import { WebSocketServer, WebSocket } from "ws";
import { randomBytes } from "crypto";
import { LoggerFactory } from "../../utils/logger/index.js";
import { HashSumService } from "../../utils/redis/stats.js";

export default function listen(server : any){

    const currentServer = new WebSocketServer({ server });
    const allClientsMap = new Map<string, WebSocket>();
    const logger = LoggerFactory.newLogger('websocket');
    const service = new HashSumService();

    setInterval(async () => {
        const stats = await service.allStats();

        for(const client of allClientsMap.values()){
            client.send(JSON.stringify(stats));
        }
    }, 3 * 1000);

    currentServer.on("connection", ws => {
        const id = randomBytes(256).toString('hex');
        logger.info(`received new connection`, { connectionId: id })

        allClientsMap.set(id, ws);
        ws.on("close", () => {
            allClientsMap.delete(id);
        });

    });

    return currentServer;
};