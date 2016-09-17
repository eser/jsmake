/**
 * jsmake
 *
 * @version v0.0.1
 * @link http://eser.ozvataf.com
 */
'use strict';

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _updateNotifier = require('update-notifier');

var _updateNotifier2 = _interopRequireDefault(_updateNotifier);

var _maester = require('maester');

var _maester2 = _interopRequireDefault(_maester);

var _ArgvList = require('./ArgvList.js');

var _ArgvList2 = _interopRequireDefault(_ArgvList);

var _ = require('./');

var _2 = _interopRequireDefault(_);

var _package = require('../package.json');

var _package2 = _interopRequireDefault(_package);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let exitCode = 0;

const argv = _2.default.utils.parseArgv(process.argv.slice(2), {
    configuration: {
        'short-option-groups': false,
        'camel-case-expansion': true,
        'dot-notation': false,
        'parse-numbers': false,
        'boolean-negation': false
    }
});

const argvList = new _ArgvList2.default({
    'makefile': {
        aliases: ['f'],
        type: String,
        parameter: 'FILE',
        description: 'Load tasks from FILE.',
        min: 0,
        max: undefined,
        'default': ['makefile.js']
    },
    'tasks': {
        type: Boolean,
        aliases: ['t'],
        description: 'Lists defined tasks.',
        min: 0,
        max: 1,
        'default': false
    },
    'quiet': {
        type: Boolean,
        aliases: ['q'],
        description: 'Turns off output of non-critical log messages.',
        min: 0,
        max: 1,
        'default': false
    },
    'version': {
        type: Boolean,
        aliases: ['v'],
        description: 'Displays the jsmake version.',
        min: 0,
        max: 1,
        'default': false
    },
    'help': {
        type: Boolean,
        aliases: ['?'],
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
} else {
    minimumSeverity = 'info';
}

const logger = _maester2.default.addLogger('ConsoleLogger', minimumSeverity);

process.on('uncaughtException', err => {
    console.error(err.stack);
    exitCode = 1;
});

process.on('exit', () => {
    process.exit(exitCode);
});

(0, _updateNotifier2.default)({ pkg: _package2.default }).notify({ defer: false });

if (argValues.version.value) {
    console.log(`jsmake version ${ _2.default.getVersion() }`);
} else if (argValues.help.value) {
    console.log('Usage: jsmake [command]\n');
    console.log(argvList.help());
} else {
    for (const makefile of argValues.makefile.value) {
        const makefilePath = _path2.default.join(process.cwd(), makefile);

        _2.default.loadFile(makefilePath);
    }

    if (argValues.tasks.value) {
        for (const task of _2.default.getTaskNames()) {
            console.log(task);
        }
    } else {
        const runContext = _2.default.createRunContext();

        runContext.setArgv(argv);
        runContext.execute();
    }
}