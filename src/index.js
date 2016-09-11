import events from 'events';
import maester from 'maester';
import Task from './Task.js';
import RunContext from './RunContext.js';
import Utils from './Utils.js';

class JsMake {
    constructor() {
        this.events = new events.EventEmitter();
        this.tasks = {};
        this.logger = maester;
        this.utils = new Utils();

        this.errors = {
            unknown_task: Symbol('unknown task'),
            task_validation_failed: Symbol('task validation failed')
        };
    }

    loadFile(filepath) {
        require(filepath);
    }

    task(name, p1, p2) {
        // p1 as task instance
        if (p1.constructor !== Array && p1.constructor !== Function && p1 instanceof Object) {
            this.tasks[name] = p1;
        }
        // p1 as method
        else if (p2 === undefined) {
            this.tasks[name] = new Task(this, name, [], p1);
        }
        // p1 as prerequisites, p2 as method
        else {
            this.tasks[name] = new Task(this, name, p1, p2);
        }
    }

    createRunContext() {
        return new RunContext(this);
    }

    async exec(args) {
        const runContext = this.createRunContext();

        runContext.setArgs(args);

        return await runContext.execute();
    }

    help() {
        this.logger.info('Usage: jsmake [command]');
    }
}

const instance = new JsMake();

if (global.jsmake === undefined) {
    global.jsmake = instance;
}

module.exports = instance;
