import { pino } from 'pino';

export class LoggerFactory {

    private static opts = {};

    static newLogger(name : string, level = 'info'){
        return pino({
            ...this.opts,
            name,
            level
        });
    }

}