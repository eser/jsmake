/*global process, console  */
import path from 'path';
import updateNotifier from 'update-notifier';
import maester from 'maester';
import consultant from 'consultant';
import jsmake from './';
import { alignedString } from './utils/alignedString.js';
import pkg from '../package.json';

let exitCode = 0;

const argvPage = consultant.createPage(
    'Homepage',
    {
        makefile: {
            type: String,
            aliases: [ 'f' ],
            label: 'Makefile',
            parameter: 'FILE',
            description: 'Load tasks from FILE',
            'default': [ 'makefile.js' ],
            min: 0,
            max: undefined,
            validate: function (value) {
                return value.length >= 3 || 'minimum 3 chars required';
            }
        },
        _: {
            type: String,
            label: 'Task',
            description: 'Tasks to execute',
            'default': [],
            helpHidden: true,
            min: 0,
            max: undefined
        },
        tasks: {
            type: Boolean,
            aliases: [ 't' ],
            label: 'Tasks',
            description: 'Lists defined tasks',
            'default': false,
            uiHidden: true,
            min: 0,
            max: 1
        },
        taskmenu: {
            type: Boolean,
            label: 'Task Menu',
            description: 'Displays the task menu',
            'default': false,
            uiHidden: true,
            min: 0,
            max: 1
        },
        verbosity: {
            type: String,
            label: 'Verbosity',
            description: 'Sets verbosity of log messages [debug, warn, info, error]',
            'default': 'info',
            values: [ 'debug', 'warn', 'info', 'error' ],
            uiHidden: true,
            min: 0,
            max: 1
        },
        version: {
            type: Boolean,
            aliases: [ 'v' ],
            label: 'Version',
            description: 'Displays the jsmake version',
            'default': false,
            uiHidden: true,
            min: 0,
            max: 1
        },
        help: {
            type: Boolean,
            aliases: [ 'h', '?' ],
            label: 'Help',
            description: 'Displays this help message',
            'default': false,
            uiHidden: true,
            min: 0,
            max: 1
        }
    }
);

const argv = consultant.parse(process.argv.slice(2)),
    argValidated = argvPage.validate(argv);

const logger = maester.addLogger('ConsoleLogger', argValidated.argv.verbosity);

process.on('uncaughtException', (err) => {
    console.error(err.stack);
    exitCode = 1;
});

process.on('exit', () => {
    process.exit(exitCode);
});

updateNotifier({ pkg: pkg })
    .notify({ defer: false });

if (argValidated.argv.version) {
    console.log(`${pkg.name} version ${jsmake.getVersion()}`);
}
else {
    for (const makefile of argValidated.argv.makefile) {
        const makefilePath = path.join(process.cwd(), makefile);

        jsmake.loadFile(makefilePath);
    }

    if (argValidated.argv.tasks) {
        for (const task of jsmake.getTaskNames()) {
            console.log(task);
        }
    }
    else if (argValidated.argv.help) {
        const output = [
            'Usage: jsmake [command] [parameters]',
            ''
        ];

        argvPage.help(output);
        jsmake.help(output, 2);

        console.log(output.join('\n'));
    }
    else if (
        argValidated.argv.taskmenu ||
        (argValidated.argv._.length === 0 && jsmake.tasks.default === undefined)
        ) {
        const taskPage = consultant.createPage(
            'Task Menu',
            {
                _: {
                    type: String,
                    label: 'Task',
                    description: 'The task to be executed',
                    
                    values: Object.keys(jsmake.tasks).map(
                        (taskKey) => {
                            const task = jsmake.tasks[taskKey];

                            return {
                                name: alignedString([ 0, task.name, 35, task.description ]),
                                value: task.name,
                                'short': task.name
                            };
                        }
                    ),
                    min: 0,
                    max: undefined
                }
            }
        );

        taskPage.inquiry()
            .then((result) => jsmake.exec(result.argv))
            .catch((err) => {
                maester.error(err);
            });
    }
    else {
        jsmake.exec(argv)
            .catch((err) => {
                maester.error(err);
            });
    }
}
