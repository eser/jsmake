import EventEmitter = require('es6-eventemitter');
import Senior = require('senior');
import { Command, CommandSet } from './CommandSet';
import { Utils } from './Utils';
export declare class JsMake extends CommandSet {
    events: EventEmitter;
    logger: any;
    plugins: Senior;
    utils: Utils;
    errors: {
        [key: string]: any;
    };
    lastDescription: string;
    constructor();
    loadPlugins(): void;
    loadFile(filepath: string): Command | null;
    desc(description: string): void;
    task(pathstr: string, ...params: any[]): void;
    getVersion(): string | undefined;
}
export default JsMake;
