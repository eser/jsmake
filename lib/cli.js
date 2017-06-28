"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const updateNotifier = require("update-notifier");
const maester = require("maester");
const consultant = require("consultant");
const ponyfills_1 = require("ponyfills");
const jsmake = require("./");
const pkg = require("../package.json");
let exitCode = 0;
const argvPageRules = {
    makefile: {
        type: String,
        aliases: ['f'],
        label: 'Makefile',
        parameter: 'FILE',
        description: 'Load tasks from FILE',
        'default': ['makefile.js'],
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
        values: ['debug', 'warn', 'info', 'error'],
        uiHidden: true,
        min: 0,
        max: 1
    },
    version: {
        type: Boolean,
        aliases: ['v'],
        label: 'Version',
        description: 'Displays the jsmake version',
        'default': false,
        uiHidden: true,
        min: 0,
        max: 1
    },
    help: {
        type: Boolean,
        aliases: ['h', '?'],
        label: 'Help',
        description: 'Displays this help message',
        'default': false,
        uiHidden: true,
        min: 0,
        max: 1
    }
};
const argv = consultant.input.fromCommandLine(), argValidated = argv.consume(argvPageRules);
process.on('uncaughtException', (err) => {
    console.error(err.stack);
    exitCode = 1;
});
process.on('exit', () => {
    process.exit(exitCode);
});
updateNotifier({ pkg: pkg })
    .notify({ defer: false });
if (argValidated.values.version) {
    console.log(`${pkg.name} version ${jsmake.getVersion()}`);
}
else {
    for (const makefile of argValidated.values.makefile) {
        const makefilePath = path.join(process.cwd(), makefile);
        jsmake.loadFile(makefilePath);
    }
    if (argValidated.values.help) {
        const output = [
            'Usage: jsmake [command] [parameters]',
            ''
        ];
        argvPage.help(output);
        jsmake.help(output, 2);
        console.log(output.join('\n'));
    }
    else if (argValidated.values._.length === 0 && jsmake.tasks.default === undefined) {
        jsmake.menu();
    }
    else {
        const newArgv = ponyfills_1.assign({ _: argValidated.values._ }, argValidated.remainder.source);
        jsmake.tasks.exec(newArgv)
            .catch((err) => {
            maester.error(err);
        });
    }
}
//# sourceMappingURL=cli.js.map