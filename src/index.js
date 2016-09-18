import events from 'events';
import maester from 'maester';
import Task from './Task.js';
import RunContext from './RunContext.js';
import ArgvList from './ArgvList.js';
import Utils from './Utils.js';
import alignedString from './alignedString.js';
import pkg from '../package.json';

const emptyDescription = '';

class JsMake {
    constructor() {
        this.events = new events.EventEmitter();
        this.logger = maester;
        this.utils = new Utils();

        this.errors = {
            unknownTask: Symbol('unknown task'),
            exception: Symbol('exception thrown')
        };

        this.tasks = {};
        this.description = emptyDescription;
    }

    loadFile(filepath) {
        maester.debug(`loading makefile '${filepath}'...`);
        require(filepath);
    }

    createTask(...args) {
        return new Task(...args);
    }

    createRunContext(...args) {
        return new RunContext(this, ...args);
    }

    desc(description) {
        this.description = description;
    }

    task(p1, p2, p3) {
        // p1 as task instance
        if (p1 instanceof Task) {
            this.tasks[p1.name] = p1;

            if (p1.description === undefined) {
                this.tasks[p1.name].setDescription(this.description);
            }
            this.description = emptyDescription;

            return this.tasks[p1.name];
        }

        // p1 as taskname string, p2 as action
        if (p2 !== undefined && p2.constructor === Function) {
            this.tasks[p1] = new Task(p1, this.description, undefined, undefined, p2);
            this.description = emptyDescription;

            return this.tasks[p1];
        }

        // p1 as taskname string, p2 as prerequisites, p3 as action
        this.tasks[p1] = new Task(p1, this.description, undefined, p2, p3);
        this.description = emptyDescription;

        return this.tasks[p1];
    }

    async execString(args) {
        const runContext = this.createRunContext();

        runContext.setArgs(args);

        await runContext.execute();

        return runContext;
    }

    async exec(argv) {
        const runContext = this.createRunContext();

        runContext.setArgv(argv);

        await runContext.execute();

        return runContext;
    }

    getTaskNames() {
        return Object.keys(this.tasks).map(
            (task) => this.tasks[task].name
        );
    }

    getVersion() {
        return pkg.version;
    }

    help(output, indent = 0) {
        const indentChars = ' '.repeat(indent);

        output.push(`${indentChars}Tasks                            Description`);
        output.push(`${indentChars}-------------------------------  -----------------------------------`);

        for (const key in this.tasks) {
            const task = this.tasks[key];

            output.push(
                alignedString([ 0, task.name, 35, task.description ], indentChars)
            );

            task.parameters.help(output, indentChars + 4);
        }
    }
}

const instance = new JsMake();

if (global.jsmake === undefined) {
    global.jsmake = instance;
}

module.exports = instance;
