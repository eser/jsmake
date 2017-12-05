import { Maester } from 'maester/lib/Maester';
import { Senior } from 'senior/lib/esm';
import { Command, CommandSet } from './CommandSet';
import { Utils } from './Utils';
export declare class JsMake extends CommandSet {
    logger: Maester;
    plugins: Senior;
    utils: Utils;
    errors: {
        [key: string]: any;
    };
    outputStream: any;
    lastDescription: string;
    constructor();
    loadPlugins(): void;
    loadFile(filepath: string): Command | null;
    desc(description: string): void;
    task(pathstr: string, ...params: any[]): void;
    getVersion(): string | undefined;
}
export default JsMake;
