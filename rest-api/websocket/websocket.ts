import { WebSocketServer, WebSocket } from "ws";
import { randomBytes } from "crypto";
import { LoggerFactory } from "../../utils/logger/index.js";

export default function listen(server : any){

    const currentServer = new WebSocketServer({ server });
    const allClientsMap = new Map<string, WebSocket>();
    const logger = LoggerFactory.newLogger('websocket');

    setInterval(() => {
        //const data = { totalVariations: 20_000, totalTries: 10_312, searchHash: 'daksofks' }
        for(const client of allClientsMap.values()){
            client.send(JSON.stringify({ data: 'Hello guys' }));
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