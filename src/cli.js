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

const args = process.argv.slice(2);

jsmake.loadFile(path.join(process.cwd(), 'makefile.js'));
jsmake.exec(args);
