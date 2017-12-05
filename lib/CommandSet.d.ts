import { EventEmitter } from 'es6-eventemitter/lib/EventEmitter';
import { Consultant } from 'consultant/lib/esm';
import { RunContext } from './RunContext';
export declare type CommandActionType = (argv: any, stream: any) => any | Promise<any>;
export declare type CommandLocation = {
    parent: {
        [key: string]: any;
    };
    name: string;
    instance: any;
};
export declare type Command = {
    label: string;
    description: string | undefined;
    parameters: any[];
    prerequisites: string[];
    action: CommandActionType;
    rules: any;
};
export declare const tasksProxyHandler: {
    get(target: any, name: any): any;
};
export declare class CommandSet {
    events: EventEmitter;
    taskRules: any;
    tasks: any;
    constructor();
    locateNode(nodePath: string): CommandLocation | null;
    locateNodeDirect(nodePath: string[]): CommandLocation | null;
    createNode(nodePath: string): CommandLocation;
    createNodeDirect(nodePath: string[]): CommandLocation;
    addCommand(pathstr: string, command: Command): void;
    getConsultant(): Consultant;
    exec(args: string | object): Promise<RunContext>;
    getTaskTree(): string[];
    help(stream: any, indent?: number): void;
}
export default CommandSet;
