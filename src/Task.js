import events from 'events';
import maester from 'maester';

class Task {
    static notAssigned() {
        throw new Error('task\'s callback is not assigned');
    }

    constructor(owner, name, prerequisites, callback) {
        this.owner = owner;
        this.name = name;

        this.events = new events.EventEmitter();
        this.logger = maester;

        if (prerequisites === undefined) {
            this.prerequisites = [];
            this.callback = this.constructor.notAssigned;
        }
        else {
            if (callback === undefined) {
                this.prerequisites = [];
                this.callback = prerequisites;
            }
            else {
                this.prerequisites = prerequisites;
                this.callback = callback;
            }
        }
    }

    setPrerequisites(prerequisites) {
        this.prerequisites = prerequisites;
    }

    setCallback(callback) {
        this.callback = callback;
    }

    validate(argv) {
        return true;
    }

    help() {
    }
}

export default Task;
