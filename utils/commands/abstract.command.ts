export default abstract class Command {

    async dispatch() : Promise<void> {
        console.log(`dispatching`, this.queue);
    }

    abstract validate() : void;
    abstract get queue() : string;
}