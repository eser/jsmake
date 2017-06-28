import { Consultant } from 'consultant/lib/esm';
import { EventEmitter } from 'es6-eventemitter/lib/esm';
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
    tasks: {
        [key: string]: any;
    };
    constructor();
    locatePath(pathstr: string): CommandLocation | null;
    locateNode(nodePath: string[]): {
        parent: any;
        name: string;
    };
    addCommand(pathstr: string, command: Command): void;
    getConsultant(): Consultant;
    exec(args: string | object): Promise<RunContext>;
    getTaskTree(): string[];
    help(stream: any, indent?: number): void;
}
export default CommandSet;
