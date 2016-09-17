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
    },
    alias: {
        quiet: ['q'],
        version: ['v'],
        help: ['?'],
        makefile: ['f'],
        tasks: ['t']
    },
    'boolean': ['quiet', 'version', 'help', 'tasks'],
    'default': {
        makefile: 'makefile.js'
    },
    string: ['makefile']
});

let minimumSeverity;

if (argv.quiet) {
    minimumSeverity = 'warn';
} else {
    minimumSeverity = 'info';
}

const logger = _maester2.default.addLogger('ConsoleLogger', minimumSeverity);

process.on('uncaughtException', err => {
    _maester2.default.error(err.stack);
    exitCode = 1;
});

process.on('exit', () => {
    process.exit(exitCode);
});

(0, _updateNotifier2.default)({ pkg: _package2.default }).notify({ defer: false });

if (argv.version) {
    _2.default.version();
} else if (argv.help) {
    _2.default.help();
} else {
    const makefilePath = _path2.default.join(process.cwd(), argv.makefile);

    _2.default.loadFile(makefilePath);

    if (argv.tasks) {
        _2.default.listTasks();
    } else {
        const runContext = _2.default.createRunContext();

        runContext.setArgv(argv);
        runContext.execute();
    }
}