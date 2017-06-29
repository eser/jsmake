"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class RunContext {
    constructor(consultantInstance) {
        this.executionQueue = [];
        this.consultantInstance = consultantInstance;
    }
    async enqueueCommand(commandSet, args) {
        let argv;
        if (args.constructor === Object) {
            argv = await this.consultantInstance.fromObject(args);
        }
        else {
            argv = await this.consultantInstance.fromString(args);
        }
        if (argv.commandId === undefined) {
            throw new Error('enqueueCommand: argv.commandId is undefined');
        }
        const commandLocation = commandSet.locateNode(argv.commandId);
        if (commandLocation === null) {
            throw new Error('enqueueCommand: commandLocation is null');
        }
        this.enqueueCommandDirect(commandSet, commandLocation, {
            command: commandLocation.parent[commandLocation.name],
            argv: argv
        });
    }
    enqueueCommandDirect(commandSet, commandLocation, state) {
        const command = commandLocation.parent[commandLocation.name];
        if (this.executionQueue.some(item => item.command === command)) {
            return;
        }
        if (command.prerequisites !== undefined) {
            for (const prerequisite of command.prerequisites) {
                const prerequisiteLocation = commandSet.locateNode(prerequisite);
                if (prerequisiteLocation === null) {
                    throw new Error(`prerequisite ${prerequisite} is not found for task '${command.id}'`);
                }
                this.enqueueCommandDirect(commandSet, prerequisiteLocation, state);
            }
        }
        this.executionQueue.push(state);
    }
    async executeSingle(state) {
        let result;
        const command = state.command;
        try {
            if (command.action !== undefined || command.prerequisites.length === 0) {
                const ret = command.action(state.argv, process.stdout);
                if (ret instanceof Promise) {
                    await ret;
                }
            }
            result = Promise.resolve();
        }
        catch (ex) {
            result = Promise.reject(ex);
        }
        return result;
    }
    async execute() {
        while (this.executionQueue.length > 0) {
            const state = this.executionQueue.shift();
            await this.executeSingle(state);
        }
    }
}
exports.RunContext = RunContext;
exports.default = RunContext;
//# sourceMappingURL=RunContext.js.map