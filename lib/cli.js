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
        description: 'Load tasks from FILE',
        min: 0,
        max: undefined,
        'default': ['makefile.js']
    },
    'tasks': {
        type: Boolean,
        aliases: ['t'],
        description: 'Lists defined tasks',
        min: 0,
        max: 1,
        'default': false
    },
    'verbosity': {
        type: String,
        description: 'Sets verbosity of log messages [debug, warn, info, error]',
        min: 0,
        max: 1,
        'default': 'info'
    },
    'version': {
        type: Boolean,
        aliases: ['v'],
        description: 'Displays the jsmake version',
        min: 0,
        max: 1,
        'default': false
    },
    'help': {
        type: Boolean,
        aliases: ['h', '?'],
        description: 'Displays this help message',
        min: 0,
        max: 1,
        'default': false
    }
});

const argValues = argvList.validate(argv);

const logger = _maester2.default.addLogger('ConsoleLogger', argValues.verbosity.value || 'info');

process.on('uncaughtException', err => {
    console.error(err.stack);
    exitCode = 1;
});

process.on('exit', () => {
    process.exit(exitCode);
});

(0, _updateNotifier2.default)({ pkg: _package2.default }).notify({ defer: false });

if (argValues.version.value) {
    console.log(`${ _package2.default.name } version ${ _2.default.getVersion() }`);
} else {
    for (const makefile of argValues.makefile.value) {
        const makefilePath = _path2.default.join(process.cwd(), makefile);

        _2.default.loadFile(makefilePath);
    }

    if (argValues.tasks.value) {
        for (const task of _2.default.getTaskNames()) {
            console.log(task);
        }
    } else if (argValues.help.value || argv._.length === 0 && _2.default.tasks.default === undefined) {
        const output = ['Usage: jsmake [command] [parameters]', ''];

        argvList.help(output, 0);
        _2.default.help(output, 2);

        console.log(output.join('\n'));
    } else {
        _2.default.exec(argv).catch(function (err) {
            _maester2.default.error(err);
        });
    }
}