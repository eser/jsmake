import events from 'events';
import maester from 'maester';

class Task {
    static notAssigned() {
        throw new Error('task\'s action is not assigned');
    }

    constructor(owner, name, prerequisites, action) {
        this.owner = owner;
        this.name = name;

        this.events = new events.EventEmitter();
        this.logger = maester;

        if (prerequisites === undefined) {
            this.prerequisites = [];
            this.action = this.constructor.notAssigned;
        }
        else {
            if (action === undefined) {
                this.prerequisites = [];
                this.action = prerequisites;
            }
            else {
                this.prerequisites = prerequisites;
                this.action = action;
            }
        }
    }

    setPrerequisites(prerequisites) {
        this.prerequisites = prerequisites;
    }

    setAction(action) {
        this.action = action;
    }

    validate(argv) {
        return true;
    }

    help() {
    }

    async execute(argv) {
        const action = this.action.bind(this);

        try {
            const ret = action(argv);

            if (ret instanceof Promise) {
                await ret;
            }

            this.events.emit('done');
        }
        catch (ex) {
            this.events.emit('error', ex);
        }

        this.events.emit('complete');
    }
}

export default Task;
