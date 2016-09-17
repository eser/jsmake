import path from 'path';
import updateNotifier from 'update-notifier';
import maester from 'maester';
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
        },
        alias: {
            quiet: [ 'q' ],
            version: [ 'v' ],
            help: [ '?' ],
            makefile: [ 'f' ],
            tasks: [ 't' ]
        },
        'boolean': [
            'quiet',
            'version',
            'help',
            'tasks'
        ],
        'default': {
            makefile: 'makefile.js'
        },
        string: [
            'makefile'
        ]
    }
);

let minimumSeverity;

if (argv.quiet) {
    minimumSeverity = 'warn';
}
else {
    minimumSeverity = 'info';
}

const logger = maester.addLogger('ConsoleLogger', minimumSeverity);

process.on('uncaughtException', (err) => {
    maester.error(err.stack);
    exitCode = 1;
});

process.on('exit', () => {
    process.exit(exitCode);
});

updateNotifier({ pkg: pkg })
    .notify({ defer: false });

if (argv.version) {
    jsmake.version();
}
else if (argv.help) {
    jsmake.help();
}
else {
    const makefilePath = path.join(process.cwd(), argv.makefile);

    jsmake.loadFile(makefilePath);

    if (argv.tasks) {
        jsmake.listTasks();
    }
    else {
        const runContext = jsmake.createRunContext();

        runContext.setArgv(argv);
        runContext.execute();
    }
}
