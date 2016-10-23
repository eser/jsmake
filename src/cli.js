/*global process, console  */
import path from 'path';
import updateNotifier from 'update-notifier';
import maester from 'maester';
import consultant from 'consultant';
import jsmake from './';
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

    if (argValidated.argv.help) {
        const output = [
            'Usage: jsmake [command] [parameters]',
            ''
        ];

        argvPage.help(output);
        jsmake.help(output, 2);

        console.log(output.join('\n'));
    }
    else if (argValidated.argv._.length === 0 && jsmake.tasks.default === undefined) {
        jsmake.menu();
    }
    else {
        jsmake.exec(argv)
            .catch((err) => {
                maester.error(err);
            });
    }
}
