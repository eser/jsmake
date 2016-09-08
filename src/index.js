const events = require('events'),
    childProcess = require('child_process'),
    yargsParser = require('yargs-parser'),
    Maester = require('maester'),
    Task = require('./Task.js');

class JsMake {
    constructor() {
        super();

        this.events = new events.EventEmitter();
        this.tasks = {};
    }

    task(name, prerequisites, promise) {
        this.tasks[name] = new Task(this, name, prerequisites, promise);
    }

    exec(args) {
        const argv = yargsParser(args); // .replace('  ', ' ')

        if (argv._.length === 0) {
            return false;
        }

        const taskname = argv._.pop();

        // TODO check task if exists

        return this.tasks[taskname].exec(argv);
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
}

const instance = new JsMake();

module.exports = instance;
