const events = require('events'),
    childProcess = require('child_process'),
    yargsParser = require('yargs-parser'),
    maester = require('maester'),
    Task = require('./Task.js');

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

    task(name, prerequisites, promise) {
        this.tasks[name] = new Task(this, name, prerequisites, promise);
    }

    exec(args) {
        const argv = yargsParser(args); // .replace('  ', ' ')

        if (argv._.length === 0) {
            this.help();

            return null;
        }

        const taskname = argv._.pop();

        if (!(taskname in this.tasks)) {
            this.help(taskname);

            return null;
        }

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

    help(taskname) {
        if (taskname !== undefined) {
            this.logger.error(`unknown task name - ${taskname}`);
        }

        this.logger.info('Usage: jsmake [command]');
    }
}

const instance = new JsMake();

module.exports = instance;
