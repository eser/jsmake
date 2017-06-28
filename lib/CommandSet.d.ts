import consultant = require('consultant');
import EventEmitter = require('es6-eventemitter');
import { RunContext } from './RunContext';
export declare type CommandActionType = (argv: any, stream: any) => any | Promise<any>;
export declare type CommandLocation = {
    parent: object;
    instance: Command;
    name: string;
};
export declare type Command = {
    events: EventEmitter;
    name: string;
    description: string | undefined;
    parameters: any[];
    prerequisites: string[];
    action: CommandActionType;
    rules: any;
};
export declare const ProxyHandler: {
    get(target: any, name: any): void;
};
export declare class CommandSet {
    tasks: object;
    constructor();
    locatePath(pathstr: string): CommandLocation | null;
    addCommand(pathstr: string, command: Command): void;
    buildConsultantRules(target: object, pathStack: string[]): any;
    getConsultant(): consultant;
    exec(args: string | object): Promise<RunContext>;
    getTaskTree(): string[];
    help(stream: any, indent?: number): void;
}
export default CommandSet;
