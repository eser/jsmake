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
        }
    }
);

const argValues = jsmake.argvList.validate(argv);

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
