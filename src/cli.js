import path from 'path';
import updateNotifier from 'update-notifier';
import maester from 'maester';
import ArgvList from './ArgvList.js';
import jsmake from './';
import pkg from '../package.json';

let exitCode = 0;

const argv = jsmake.utils.parseArgv(
    process.argv.slice(2),
    {
        configuration: {
            'short-option-groups': false,
            'camel-case-expansion': true,
            'dot-notation': false,
            'parse-numbers': false,
            'boolean-negation': false
        }
    }
);

const argvList = new ArgvList({
    'makefile': {
        aliases: [ 'f' ],
        type: String,
        parameter: 'FILE',
        description: 'Load tasks from FILE',
        min: 0,
        max: undefined,
        'default': [ 'makefile.js' ]
    },
    'tasks': {
        type: Boolean,
        aliases: [ 't' ],
        description: 'Lists defined tasks',
        min: 0,
        max: 1,
        'default': false
    },
    'verbosity': {
        type: String,
        description: 'Sets verbosity of log messages [debug, warn, info, error]',
        min: 0,
        max: 1,
        'default': 'info'
    },
    'version': {
        type: Boolean,
        aliases: [ 'v' ],
        description: 'Displays the jsmake version',
        min: 0,
        max: 1,
        'default': false
    },
    'help': {
        type: Boolean,
        aliases: [ 'h', '?' ],
        description: 'Displays this help message',
        min: 0,
        max: 1,
        'default': false
    }
});

const argValues = argvList.validate(argv);

const logger = maester.addLogger('ConsoleLogger', argValues.verbosity.value || 'info');

process.on('uncaughtException', (err) => {
    console.error(err.stack);
    exitCode = 1;
});

process.on('exit', () => {
    process.exit(exitCode);
});

updateNotifier({ pkg: pkg })
    .notify({ defer: false });

if (argValues.version.value) {
    console.log(`${pkg.name} version ${jsmake.getVersion()}`);
}
else {
    for (const makefile of argValues.makefile.value) {
        const makefilePath = path.join(process.cwd(), makefile);

        jsmake.loadFile(makefilePath);
    }

    if (argValues.tasks.value) {
        for (const task of jsmake.getTaskNames()) {
            console.log(task);
        }
    }
    else if (
            argValues.help.value ||
            (argv._.length === 0 && jsmake.tasks.default === undefined)
        ) {
        const output = [
            'Usage: jsmake [command] [parameters]',
            ''
        ];

        argvList.help(output, 0);
        jsmake.help(output, 2);

        console.log(output.join('\n'));
    }
    else {
        jsmake.exec(argv)
            .catch(function (err) {
                maester.error(err);
            });
    }
}
