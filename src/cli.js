import path from 'path';
import updateNotifier from 'update-notifier';
import maester from 'maester';
import jsmake from './';
import pkg from '../package.json';

let exitCode = 0;

const logger = maester.addLogger('ConsoleLogger', 'info');

process.on('uncaughtException', (err) => {
    console.error(err.stack);
    exitCode = 1;
});

process.on('exit', () => {
    process.exit(exitCode);
});

updateNotifier({ pkg: pkg })
    .notify({ defer: false });

const runContext = jsmake.createRunContext();

runContext.setArgs(process.argv.slice(2));

if (runContext.argv.quiet || runContext.argv.q) {
    logger.minimumSeverity = 'warn';
}

if (runContext.argv.version || runContext.argv.v) {
    jsmake.version();
}
else if (runContext.argv.help || runContext.argv.h) {
    jsmake.help();
}
else {
    const makefilePath = runContext.argv.makefile || runContext.argv.f || 'makefile.js';

    jsmake.loadFile(path.join(process.cwd(), makefilePath));

    if (runContext.argv.tasks || runContext.argv.t) {
        jsmake.listTasks();
    }
    else {
        runContext.execute();
    }
}
