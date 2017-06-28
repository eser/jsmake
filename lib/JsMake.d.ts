import { EventEmitter } from 'es6-eventemitter/lib/esm';
import { Maester } from 'maester/lib/esm';
import { Senior } from 'senior/lib/esm';
import { Command, CommandSet } from './CommandSet';
import { Utils } from './Utils';
export declare class JsMake extends CommandSet {
    events: EventEmitter;
    logger: Maester;
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
