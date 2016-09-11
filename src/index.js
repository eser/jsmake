const events = require('events'),
    yargsParser = require('yargs-parser'),
    maester = require('maester'),
    Task = require('./Task.js'),
    RunContext = require('./RunContext.js'),
    Utils = require('./Utils.js');

const errors = {
    no_arguments: Symbol('no arguments'),
    unknown_task: Symbol('unknown task'),
    task_validation_failed: Symbol('task validation failed')
};

class JsMake {
    constructor() {
        this.events = new events.EventEmitter();
        this.tasks = {};
        this.logger = maester;
        this.utils = new Utils();
    }

    loadFile(filepath) {
        const _jsmake = global.jsmake;

        global.jsmake = this;
        require(filepath);

        global.jsmake = _jsmake;
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

    validateArgvAndGetTask(argv) {
        if (argv._.length === 0) {
            return { error: errors.no_arguments };
        }

        const taskname = argv._.shift();

        if (!(taskname in this.tasks)) {
            return { error: errors.unknown_task, taskname: taskname };
        }

        return { error: null, task: this.tasks[taskname] };
    }

    async exec(args) {
        try {
            const argv = yargsParser(args); // .replace('  ', ' ')

            const validateResult = this.validateArgvAndGetTask(argv);

            if (validateResult.error === errors.no_arguments) {
                this.help();

                return null;
            }

            if (validateResult.error === errors.unknown_task) {
                this.logger.error(`unknown task name - ${validateResult.taskname}`);

                return null;
            }

            const task = validateResult.task;

            if (task.validate !== undefined && !task.validate(argv)) {
                if (task.help !== undefined) {
                    task.help();
                }

                return null;
            }

            const runContext = new RunContext(this, argv);

            runContext.addTask(task);

            return await runContext.execute();
        }
        catch (ex) {
            this.logger.error(ex);
        }
    }

    help() {
        this.logger.info('Usage: jsmake [command]');
    }
}

const instance = new JsMake();

module.exports = instance;
