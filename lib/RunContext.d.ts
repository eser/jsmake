import consultant = require('consultant');
import { Command, CommandSet, CommandLocation } from './CommandSet';
export declare type CommandStateType = {
    command: Command;
    argv: any;
};
export declare class RunContext {
    executionQueue: Array<CommandStateType>;
    consultantInstance: consultant;
    constructor(consultantInstance: consultant);
    enqueueCommand(commandSet: CommandSet, args: string | object): Promise<void>;
    enqueueCommandDirect(commandSet: CommandSet, commandLocation: CommandLocation, state: CommandStateType): void;
    executeSingle(state: CommandStateType): Promise<void>;
    execute(): Promise<void>;
}
export default RunContext;
