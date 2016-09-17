import events from 'events';
import maester from 'maester';
import Task from './Task.js';
import RunContext from './RunContext.js';
import Utils from './Utils.js';
import pkg from '../package.json';

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

    createTask(...args) {
        return new Task(this, ...args);
    }

    createRunContext(...args) {
        return new RunContext(this, ...args);
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

        // p1 as taskname string, p2 as action
        if (p3 === undefined) {
            this.tasks[p1] = new Task(this, p1, [], p2);

            return this.tasks[p1];
        }

        // p1 as taskname string, p2 as prerequisites, p3 as action
        this.tasks[p1] = new Task(this, p1, p2, p3);

        return this.tasks[p1];
    }

    async exec(args) {
        const runContext = this.createRunContext();

        runContext.setArgs(args);

        return await runContext.execute();
    }

    listTasks() {
        for (const item in this.tasks) {
            this.logger.info(this.tasks[item].name);
        }
    }

    version() {
        this.logger.info(`Version ${pkg.version}`);
    }

    help() {
        this.logger.info('Usage: jsmake [command]');
        this.logger.info('-f, --makefile FILE: Load tasks from FILE.');
        this.logger.info('-t, --tasks:         Lists defined tasks.');
        this.logger.info('-?, --help:          Displays this help message.');
        this.logger.info('-v, --version:       Displays the jsmake version.');
        this.logger.info('-q, --quiet:         Turns off output of non-critical log messages.');
    }
}

const instance = new JsMake();

if (global.jsmake === undefined) {
    global.jsmake = instance;
}

module.exports = instance;
