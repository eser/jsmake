import * as EventEmitter from 'es6-eventemitter';
export declare function notAssigned(argv: any, argValidated: any): Promise<any>;
export declare type CommandActionType = (argv: any, argValidated: any) => any | Promise<any>;
export declare type CommandStateType = {
    argv: any;
};
export declare class Command {
    events: EventEmitter;
    name: string;
    description: string | undefined;
    parameters: any[];
    prerequisites: string[];
    action: CommandActionType;
    menuHidden: boolean;
    constructor(name: string, description: string | undefined, parameters?: any[], prerequisites?: string[], action?: CommandActionType);
    setParameter(name: any, options: any): void;
    execute(state: CommandStateType): Promise<void>;
}
export default Command;
