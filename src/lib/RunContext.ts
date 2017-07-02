import { Consultant } from 'consultant/lib/esm';
import { Maester } from 'maester/lib/esm';
import { Command, CommandSet, CommandLocation } from './CommandSet';
import { TaskException } from './TaskException';

export type CommandStateType = {
    commandSet: CommandSet,
    commandLocation: CommandLocation,
    argv: any
};

export type ExecutionQueueItemType = {
    commandLocation: CommandLocation,
    state: CommandStateType
};

export class RunContext {
    consultantInstance: Consultant;
    logger: Maester;

    executionQueue: Array<ExecutionQueueItemType>;

    constructor(consultantInstance: Consultant, logger: Maester) {
        this.consultantInstance = consultantInstance;
        this.logger = logger;

        this.executionQueue = [];
    }

    async enqueueCommand(commandSet: CommandSet, args: string | object): Promise<void> {
        let consultation;

        if (args.constructor === Object) {
            consultation = await this.consultantInstance.fromObject(<object>args);
        }
        else {
            consultation = await this.consultantInstance.fromString(<string>args);
        }

        if (consultation.commandId === undefined) {
            throw new Error('enqueueCommand: consultation.commandId is undefined');
        }

        const commandLocation = commandSet.locateNode(consultation.commandId);

        if (commandLocation === null) {
            throw new Error('enqueueCommand: commandLocation is null');
        }

        this.enqueueCommandDirect(
            commandLocation,
            {
                commandSet: commandSet,
                commandLocation: commandLocation,
                argv: consultation
            }
        );
    }

    enqueueCommandDirect(commandLocation: CommandLocation, state: CommandStateType): void {
        const command = commandLocation.instance;

        if (this.executionQueue.some(item => item.commandLocation.instance === command)) {
            return;
        }

        if (command.prerequisites !== undefined) {
            for (const prerequisite of command.prerequisites) {
                const prerequisiteLocation = state.commandSet.locateNode(prerequisite);

                if (prerequisiteLocation === null) {
                    throw new Error(`prerequisite '${prerequisite}' is not found for task '${command.id}'`);
                }

                this.enqueueCommandDirect(prerequisiteLocation, state);
            }
        }

        // TODO pre and post tasks

        // const preTaskName = `pre-${commandLocation.name}`,
        //     postTaskName = `post-${commandLocation.name}`;

        // if (preTaskName in commandLocation.parent) {
        //     this.enqueueCommandDirect(commandSet, preTaskName, state);
        // }

        this.executionQueue.push({
            commandLocation: commandLocation,
            state: state
        });

        // if (postTaskName in commandLocation.parent) {
        //     this.enqueueCommandDirect(commandSet, postTaskName, state);
        // }
    }

    async executeSingle(executionQueueItem: ExecutionQueueItemType): Promise<void> {
        let result;

        const command = executionQueueItem.commandLocation.instance,
            state = executionQueueItem.state;

        try {
            if (command.action !== undefined || command.prerequisites.length === 0) {
                const ret = command.action(
                    state.argv,
                    this.logger
                );

                if (ret instanceof Promise) {
                    await ret;
                }
            }

            state.commandSet.events.emit('done', state);

            result = Promise.resolve();
        }
        catch (ex) {
            state.commandSet.events.emit('error', ex, state);

            // TODO wrap with TaskException
            result = Promise.reject(ex);
        }

        state.commandSet.events.emit('complete', state);

        return result;
    }

    async execute(): Promise<void> {
        while (this.executionQueue.length > 0) {
            const executionQueueItem = <ExecutionQueueItemType>this.executionQueue.shift();

            await this.executeSingle(executionQueueItem);
        }
    }
}

export default RunContext;
