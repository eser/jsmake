const events = require('events'),
    childProcess = require('child_process'),
    yargsParser = require('yargs-parser'),
    maester = require('maester'),
    Task = require('./Task.js');

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

    addTaskToRunContext(task, runContext) {
        for (let prerequisite of task.prerequisites) {
            const prerequisiteTask = this.tasks[prerequisite];

            this.addTaskToRunContext(prerequisiteTask, runContext);
        }

        if (runContext.prerequisites.order.indexOf(task.name) >= 0) {
            return;
        }

        runContext.prerequisites.order.push(task.name);
    }

    buildRunContext(task, argv) {
        const runContext = {
            task: task,
            argv: argv,
            prerequisites: {
                order: [],
                promises: {}
            }
        };

        this.addTaskToRunContext(task, runContext);

        return runContext;
    }

    executeRunContext(runContext) {
        return runContext.task.exec(runContext.argv);
    }

    exec(args) {
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

            if (!task.validate(argv)) {
                task.help();

                return null;
            }

            const runContext = this.buildRunContext(task, argv);

            return this.executeRunContext(runContext);
        }
        catch (ex) {
            this.logger.error(ex);
        }
    }

    shell(commands) {
        const commands_ = (commands.constructor === Array) ? commands : [ commands ];

        for (let command of commands_) {
            childProcess.spawnSync(
                command,
                [],
                {
                    stdio: 'inherit',
                    shell: true
                }
            );
        }
    }

    help() {
        this.logger.info('Usage: jsmake [command]');
    }
}

const instance = new JsMake();

module.exports = instance;
