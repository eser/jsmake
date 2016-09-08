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

    exec(command) {
        // TODO not implemented yet
        // this.tasks[taskname].exec(yargsParsedArgs);
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
