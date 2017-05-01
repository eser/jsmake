import { Command, CommandStateType } from './Command';
import { CommandSet } from './CommandSet';
import { TaskException } from './TaskException';

export class RunContext {
    executionQueue: Array<{ command: Command, state: CommandStateType }>;

    constructor() {
        this.executionQueue = [];
    }

    enqueueCommand(commandSetRoot: CommandSet, args: string, state: CommandStateType) {
        const target = commandSetRoot.locateCommandSet(args);

        this.enqueueCommandDirect(target.parent, target.name, state);
    }

    enqueueCommandDirect(commandSet: CommandSet, commandName: string, state: CommandStateType) {
        const command: Command = commandSet[commandName];

        if (!(command instanceof Command)) {
            throw new TaskException(`${commandName} is not a valid command`);
        }

        if (this.executionQueue.filter(item => item.command.name == command.name).length > 0) {
            return;
        }

        if (command.prerequisites !== undefined) {
            for (const prerequisite of command.prerequisites) {
                this.enqueueCommandDirect(commandSet, prerequisite, state);
            }
        }

        const preTaskName = `pre-${command.name}`,
            postTaskName = `post-${command.name}`;

        if (preTaskName in commandSet) {
            this.enqueueCommandDirect(commandSet, preTaskName, state);
        }

        this.executionQueue.push({ command: command, state: state });

        if (postTaskName in commandSet) {
            this.enqueueCommandDirect(commandSet, postTaskName, state);
        }
    }

    async execute() {
        while (this.executionQueue.length > 0) {
            const item = this.executionQueue.shift();

            // this.logger.debug('running task ${item.command.name}');

            if (item === undefined) {
                continue;
            }

            await item.command.execute(item.state);
        }
    }
}

export default RunContext;
