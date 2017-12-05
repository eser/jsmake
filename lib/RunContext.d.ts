import { Consultant } from 'consultant/lib/esm';
import { Maester } from 'maester/lib/Maester';
import { CommandSet, CommandLocation } from './CommandSet';
export declare type CommandStateType = {
    commandSet: CommandSet;
    commandLocation: CommandLocation;
    argv: any;
};
export declare type ExecutionQueueItemType = {
    commandLocation: CommandLocation;
    state: CommandStateType;
};
export declare class RunContext {
    consultantInstance: Consultant;
    logger: Maester;
    executionQueue: Array<ExecutionQueueItemType>;
    constructor(consultantInstance: Consultant, logger: Maester);
    enqueueCommand(commandSet: CommandSet, args: string | object): Promise<void>;
    enqueueCommandDirect(commandLocation: CommandLocation, state: CommandStateType): void;
    executeSingle(executionQueueItem: ExecutionQueueItemType): Promise<void>;
    execute(): Promise<void>;
}
export default RunContext;
