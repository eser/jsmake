import path = require('path');
import updateNotifier = require('update-notifier');
import consultant = require('consultant');
import { assign } from 'ponyfills';
import * as jsmake from './';
import * as pkg from '../package.json';

let exitCode = 0;

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

const args = process.argv.slice(2).join(' ');

jsmake.exec(args)
    .catch((err) => {
        jsmake.logger.error(err);
    });

// if (argValidated.values.version) {
//     console.log(`${pkg.name} version ${jsmake.getVersion()}`);
// }
// else {
//     for (const makefile of argValidated.values.makefile) {
//         const makefilePath = path.join(process.cwd(), makefile);

//         jsmake.loadFile(makefilePath);
//     }

//     // TODO help
//     if (argValidated.values.help) {
//         const output = [
//             'Usage: jsmake [command] [parameters]',
//             ''
//         ];

//         argvPage.help(output);
//         jsmake.help(output, 2);

//         console.log(output.join('\n'));
//     }
//     // TODO menu
//     else if (argValidated.values._.length === 0 && jsmake.tasks.default === undefined) {
//         jsmake.menu();
//     }
//     else {
//         // TODO
//         const newArgv = assign(
//             { _: argValidated.values._ },
//             argValidated.remainder.source
//         );

//         jsmake.tasks.exec(newArgv)
//             .catch((err) => {
//                 maester.error(err);
//             });
//     }
// }
