import consultant = require('consultant');
import { Command, CommandSet, CommandLocation } from './CommandSet';
import { TaskException } from './TaskException';

export type CommandStateType = { command: Command, argv: any };

export class RunContext {
    executionQueue: Array<CommandStateType>;
    consultantInstance: consultant;

    constructor(consultantInstance: consultant) {
        this.executionQueue = [];
        this.consultantInstance = consultantInstance;
    }

    async enqueueCommand(commandSet: CommandSet, args: string | object): Promise<void> {
        let argv;

        if (args.constructor === Object) {
            argv = await this.consultantInstance.fromObject(<object>args);
        }
        else {
            argv = await this.consultantInstance.fromString(<string>args);
        }

        if (argv.commandId === undefined) {
            throw new Error('enqueueCommand: argv.commandId is undefined');
        }

        const commandLocation = commandSet.locatePath(argv.commandId);

        if (commandLocation === null) {
            throw new Error('enqueueCommand: commandLocation is null');
        }

        this.enqueueCommandDirect(
            commandSet,
            commandLocation,
            {
                command: commandLocation.instance,
                argv: argv
            }
        );
    }

    enqueueCommandDirect(commandSet: CommandSet, commandLocation: CommandLocation, state: CommandStateType): void {
        if (this.executionQueue.some(item => item.command === commandLocation.instance)) {
            return;
        }

        const command = commandLocation.instance;

        if (command.prerequisites !== undefined) {
            for (const prerequisite of command.prerequisites) {
                const prerequisiteLocation = commandSet.locatePath(prerequisite);

                if (prerequisiteLocation === null) {
                    throw new Error(`prerequisite ${prerequisite} is not found for task ${command.name}`);
                }

                this.enqueueCommandDirect(commandSet, prerequisiteLocation, state);
            }
        }

        // const preTaskName = `pre-${command.name}`,
        //     postTaskName = `post-${command.name}`;

        // if (preTaskName in commandSet) {
        //     this.enqueueCommandDirect(commandSet, preTaskName, state);
        // }

        this.executionQueue.push(state);

        // if (postTaskName in commandSet) {
        //     this.enqueueCommandDirect(commandSet, postTaskName, state);
        // }
    }

    async executeSingle(state: CommandStateType): Promise<void> {
        let result;

        const command = state.command;

        try {
            if (command.action !== undefined || command.prerequisites.length === 0) {
                const ret = command.action(state.argv, process.stdout);

                if (ret instanceof Promise) {
                    await ret;
                }
            }

            // command.events.emit('done');

            result = Promise.resolve();
        }
        catch (ex) {
            // command.events.emit('error', ex);

            result = Promise.reject(ex);
        }

        // command.events.emit('complete');

        return result;
    }

    async execute(): Promise<void> {
        while (this.executionQueue.length > 0) {
            const state = <CommandStateType>this.executionQueue.shift();

            await this.executeSingle(state);
        }
    }
}

export default RunContext;
