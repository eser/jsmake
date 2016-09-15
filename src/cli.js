import path from 'path';
import updateNotifier from 'update-notifier';
import maester from 'maester';
import jsmake from './';
import pkg from '../package.json';

let exitCode = 0;

const argv = jsmake.utils.parseArgv(process.argv.slice(2));

let minimumSeverity;

if (argv.quiet || argv.q) {
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

if (argv.version || argv.v) {
    jsmake.version();
}
else if (argv.help || argv.h) {
    jsmake.help();
}
else {
    const makefilePath = argv.makefile || argv.f || 'makefile.js';

    jsmake.loadFile(path.join(process.cwd(), makefilePath));

    if (argv.tasks || argv.t) {
        jsmake.listTasks();
    }
    else {
        const runContext = jsmake.createRunContext();

        runContext.setArgv(argv);
        runContext.execute();
    }
}
