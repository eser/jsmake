import path from 'path';
import updateNotifier from 'update-notifier';
import maester from 'maester';
import jsmake from './';
import pkg from '../package.json';

let exitCode = 0;

maester.addLogger('ConsoleLogger');

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

if (runContext.argv.help) {
    jsmake.help();
}
else {
    const makefilePath = runContext.argv.makefile || 'makefile.js';

    jsmake.loadFile(path.join(process.cwd(), makefilePath));

    if (runContext.argv.tasks) {
        jsmake.listTasks();
    }
    else {
        runContext.execute();
    }
}
