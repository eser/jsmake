/*global process, console  */
import * as path from 'path';
import * as updateNotifier from 'update-notifier';
import * as maester from 'maester';
import * as consultant from 'consultant';
import * as jsmake from './';
import * as pkg from '../package.json';

let exitCode = 0;

const argvPageRules = {
    makefile: {
        type: String,
        aliases: [ 'f' ],
        label: 'Makefile',
        parameter: 'FILE',
        description: 'Load tasks from FILE',
        'default': [ 'makefile.js' ],
        min: 0,
        max: undefined,
        validate: (value) => value.length >= 3 || 'minimum 3 chars required'
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
};

const argv = consultant.input.fromCommandLine(),
    argValidated = argv.consume(argvPageRules);

// const logger = maester.addLogger('ConsoleLogger', argValidated.values.verbosity);

process.on('uncaughtException', (err) => {
    console.error(err.stack);
    exitCode = 1;
});

process.on('exit', () => {
    process.exit(exitCode);
});

updateNotifier({ pkg: pkg })
    .notify({ defer: false });

// TODO check argValidated.isValid, if it's false output errors then exit
// console.log(JSON.stringify(argValidated, null, 4));

if (argValidated.values.version) {
    console.log(`${pkg.name} version ${jsmake.getVersion()}`);
}
else {
    for (const makefile of argValidated.values.makefile) {
        const makefilePath = path.join(process.cwd(), makefile);

        jsmake.loadFile(makefilePath);
    }

    // TODO help
    if (argValidated.values.help) {
        const output = [
            'Usage: jsmake [command] [parameters]',
            ''
        ];

        argvPage.help(output);
        jsmake.help(output, 2);

        console.log(output.join('\n'));
    }
    // TODO menu
    else if (argValidated.values._.length === 0 && jsmake.tasks.default === undefined) {
        jsmake.menu();
    }
    else {
        // TODO
        const newArgv = Object.assign(
            { _: argValidated.values._ },
            argValidated.remainder.source
        );

        jsmake.tasks.exec(newArgv)
            .catch((err) => {
                maester.error(err);
            });
    }
}
