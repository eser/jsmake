import events from 'events';
import maester from 'maester';
import Task from './Task.js';
import RunContext from './RunContext.js';
import Utils from './Utils.js';
import pkg from '../package.json';

const emptyDescription = '';

class JsMake {
    constructor() {
        this.events = new events.EventEmitter();
        this.logger = maester;
        this.utils = new Utils();

        this.errors = {
            unknownTask: Symbol('unknown task'),
            taskValidationFailed: Symbol('task validation failed'),
            exception: Symbol('exception thrown')
        };

        this.tasks = {};
        this.description = emptyDescription;
    }

    loadFile(filepath) {
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

    async exec(args) {
        const runContext = this.createRunContext();

        runContext.setArgs(args);

        return await runContext.execute();
    }

    getTaskNames() {
        return Object.keys(this.tasks).map(
            (task) => this.tasks[task].name
        );
    }

    getVersion() {
        return pkg.version;
    }

    getHelp() {
        const output = [
            'Usage: jsmake [command] [parameters]',
            '',
            ' Tasks                           Description',
            ' ------------------------------  -----------------------------------'
        ];

        for (const key in this.tasks) {
            const task = this.tasks[key];

            let lineOutput = ` ${task.name}`;

            output.push(`${lineOutput}${' '.repeat(32 - lineOutput.length)} ${task.description}`);

            if (task.parameters !== undefined) {
                const parametersHelp = task.parameters.help();

                if (parametersHelp.length > 0) {
                    output.push('   Parameters:');
                    for (const line of parametersHelp) {
                        output.push(`   ${line}`);
                    }
                    output.push('');
                }
            }
        }

        return output;
    }
}

const instance = new JsMake();

if (global.jsmake === undefined) {
    global.jsmake = instance;
}

module.exports = instance;
