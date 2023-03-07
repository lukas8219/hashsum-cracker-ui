import { QueueNames } from "../../commons/queues.js";
import Command from "./abstract.command.js";

export default class HashSumCrackStartCommand extends Command {

    constructor(readonly maxLength : number, readonly searchHash : string){
        super();
    };

    validate(): void {
       return;
    }
    get queue(): QueueNames {
        return QueueNames.HASHSUM_CRACK_COMMAND;
    }
    
}