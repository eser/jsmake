"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class RunContext {
    constructor(consultantInstance, logger) {
        this.consultantInstance = consultantInstance;
        this.logger = logger;
        this.executionQueue = [];
    }
    async enqueueCommand(commandSet, args) {
        let consultation;
        if (args.constructor === Object) {
            consultation = await this.consultantInstance.fromObject(args);
        }
        else {
            consultation = await this.consultantInstance.fromString(args);
        }
        if (consultation.commandId === undefined) {
            throw new Error('enqueueCommand: consultation.commandId is undefined');
        }
        const commandLocation = commandSet.locateNode(consultation.commandId);
        if (commandLocation === null) {
            throw new Error('enqueueCommand: commandLocation is null');
        }
        this.enqueueCommandDirect(commandLocation, {
            commandSet: commandSet,
            commandLocation: commandLocation,
            argv: consultation
        });
    }
    enqueueCommandDirect(commandLocation, state) {
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
        this.executionQueue.push({
            commandLocation: commandLocation,
            state: state
        });
    }
    async executeSingle(executionQueueItem) {
        let result;
        const command = executionQueueItem.commandLocation.instance, state = executionQueueItem.state;
        try {
            if (command.action !== undefined || command.prerequisites.length === 0) {
                const ret = command.action(state.argv, this.logger);
                if (ret instanceof Promise) {
                    await ret;
                }
            }
            state.commandSet.events.emit('done', state);
            result = Promise.resolve();
        }
        catch (ex) {
            state.commandSet.events.emit('error', ex, state);
            result = Promise.reject(ex);
        }
        state.commandSet.events.emit('complete', state);
        return result;
    }
    async execute() {
        while (this.executionQueue.length > 0) {
            const executionQueueItem = this.executionQueue.shift();
            await this.executeSingle(executionQueueItem);
        }
    }
}
exports.RunContext = RunContext;
exports.default = RunContext;
//# sourceMappingURL=RunContext.js.map