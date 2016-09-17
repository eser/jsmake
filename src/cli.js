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
        description: 'Load tasks from FILE.',
        min: 0,
        max: undefined,
        'default': [ 'makefile.js' ]
    },
    'tasks': {
        type: Boolean,
        aliases: [ 't' ],
        description: 'Lists defined tasks.',
        min: 0,
        max: 1,
        'default': false
    },
    'quiet': {
        type: Boolean,
        aliases: [ 'q' ],
        description: 'Turns off output of non-critical log messages.',
        min: 0,
        max: 1,
        'default': false
    },
    'version': {
        type: Boolean,
        aliases: [ 'v' ],
        description: 'Displays the jsmake version.',
        min: 0,
        max: 1,
        'default': false
    },
    'help': {
        type: Boolean,
        aliases: [ '?' ],
        description: 'Displays this help message.',
        min: 0,
        max: 1,
        'default': false
    }
});

const argValues = argvList.validate(argv);

let minimumSeverity;

if (argValues.quiet.value) {
    minimumSeverity = 'warn';
}
else {
    minimumSeverity = 'info';
}

const logger = maester.addLogger('ConsoleLogger', minimumSeverity);

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
    console.log(`jsmake version ${jsmake.getVersion()}`);
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
        console.log(jsmake.getHelp().join('\n'));
    }
    else {
        const runContext = jsmake.createRunContext();

        runContext.setArgv(argv);
        runContext.execute();
    }
}
