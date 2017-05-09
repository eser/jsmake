import EventEmitter = require('es6-eventemitter');
import Senior = require('senior');
import { Command } from './Command';
import { CommandSet } from './CommandSet';
import { Utils } from './Utils';
export declare class JsMake {
    events: EventEmitter;
    logger: any;
    tasks: CommandSet;
    plugins: Senior;
    utils: Utils;
    errors: {
        [key: string]: any;
    };
    description: string;
    constructor();
    loadPlugins(): void;
    loadFile(filepath: any): any;
    desc(description: any): void;
    task(name: any, ...params: any[]): Command;
    getVersion(): any;
    help(output: any, indent?: number): void;
    menu(): Promise<boolean>;
}
export default JsMake;
