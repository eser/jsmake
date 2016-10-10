import events from 'events';
import consultant from 'consultant';
import TaskException from './TaskException.js';

export default class Task {
    static async notAssigned() {
        throw new TaskException('task\'s action is not assigned');
    }

    static from(source) {
        const task = new this(source.name, source.description, undefined, undefined, undefined);

        return Object.assign(task, source);
    }

    constructor(name, description, parameters, prerequisites, action) {
        this.events = new events.EventEmitter();

        this.name = name;
        this.description = description;

        if (parameters === undefined) {
            this.parameters = consultant.createRuleCollection();
        }
        else {
            this.parameters = parameters;
        }

        if (prerequisites === undefined) {
            this.prerequisites = [];
        }
        else {
            this.prerequisites = prerequisites;
        }

        if (action === undefined) {
            this.action = this.constructor.notAssigned;
        }
        else {
            this.action = action;
        }
    }

    setDescription(description) {
        this.description = description;
    }

    setParameters(parameters) {
        this.parameters = parameters;
    }

    setPrerequisites(prerequisites) {
        this.prerequisites = prerequisites;
    }

    setAction(action) {
        this.action = action;
    }

    async execute(argv) {
        try {
            if (this.action !== this.constructor.notAssigned || this.prerequisites.length === 0) {
                const argValidated = this.parameters.validate(argv),
                    ret = this.action(argv, argValidated);

                if (ret instanceof Promise) {
                    await ret;
                }
            }

            this.events.emit('done');
        }
        catch (ex) {
            this.events.emit('error', ex);
        }

        this.events.emit('complete');
    }
}
