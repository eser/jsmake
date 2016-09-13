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
            unknownTask: Symbol('unknown task'),
            taskValidationFailed: Symbol('task validation failed'),
            exception: Symbol('exception thrown')
        };
    }

    loadFile(filepath) {
        require(filepath);
    }

    newTask(...args) {
        return new Task(this, ...args);
    }

    task(p1, p2, p3) {
        // p1 as task instance
        if (p1 instanceof Task) {
            this.tasks[p1.name] = p1;

            return this.tasks[p1.name];
        }

        // p1 as object instance
        if (p1.constructor !== Array && p1.constructor !== Function && p1 instanceof Object) {
            this.tasks[p1.name] = Object.assign(new Task(this), p1);

            return this.tasks[p1.name];
        }

        // p1 as taskname string
        if (p2 === undefined) {
            return this.tasks[p1];
        }

        // p1 as taskname string, p2 as method
        if (p3 === undefined) {
            this.tasks[p1] = new Task(this, p1, [], p2);

            return this.tasks[p1];
        }

        // p1 as taskname string, p2 as prerequisites, p3 as method
        this.tasks[p1] = new Task(this, p1, p2, p3);

        return this.tasks[p1];
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
