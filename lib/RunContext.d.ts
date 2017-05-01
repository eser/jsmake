import { Command, CommandStateType } from './Command';
import { CommandSet } from './CommandSet';
export declare class RunContext {
    executionQueue: Array<{
        command: Command;
        state: CommandStateType;
    }>;
    constructor();
    enqueueCommand(commandSetRoot: CommandSet, args: string, state: CommandStateType): void;
    enqueueCommandDirect(commandSet: CommandSet, commandName: string, state: CommandStateType): void;
    execute(): Promise<void>;
}
export default RunContext;
