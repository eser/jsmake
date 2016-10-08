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

var _consultant = require('consultant');

var _consultant2 = _interopRequireDefault(_consultant);

var _ = require('./');

var _2 = _interopRequireDefault(_);

var _package = require('../package.json');

var _package2 = _interopRequireDefault(_package);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*global process, console  */


let exitCode = 0;

const argvPage = _consultant2.default.createPage('Homepage', {
    makefile: {
        type: String,
        aliases: ['f'],
        label: 'Makefile',
        parameter: 'FILE',
        description: 'Load tasks from FILE',
        'default': ['makefile.js'],
        min: 0,
        max: undefined,
        validate: function validate(value) {
            return value.length >= 3 || 'minimum 3 chars required';
        }
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
    tasks: {
        type: Boolean,
        aliases: ['t'],
        label: 'Tasks',
        description: 'Lists defined tasks',
        'default': false,
        uiHidden: true,
        min: 0,
        max: 1
    },
    taskmenu: {
        type: Boolean,
        label: 'Task Menu',
        description: 'Displays the task menu',
        'default': false,
        uiHidden: true,
        min: 0,
        max: 1
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
});

const argv = _consultant2.default.parse(process.argv.slice(2)),
      argValidated = argvPage.validate(argv);

const logger = _maester2.default.addLogger('ConsoleLogger', argValidated.argv.verbosity);

process.on('uncaughtException', err => {
    console.error(err.stack);
    exitCode = 1;
});

process.on('exit', () => {
    process.exit(exitCode);
});

(0, _updateNotifier2.default)({ pkg: _package2.default }).notify({ defer: false });

if (argValidated.argv.version) {
    console.log(`${ _package2.default.name } version ${ _2.default.getVersion() }`);
} else {
    for (const makefile of argValidated.argv.makefile) {
        const makefilePath = _path2.default.join(process.cwd(), makefile);

        _2.default.loadFile(makefilePath);
    }

    if (argValidated.argv.tasks) {
        for (const task of _2.default.getTaskNames()) {
            console.log(task);
        }
    } else if (argValidated.argv.help) {
        const output = ['Usage: jsmake [command] [parameters]', ''];

        argvPage.help(output);
        _2.default.help(output, 2);

        console.log(output.join('\n'));
    } else if (argValidated.argv.taskmenu || argValidated.argv._.length === 0 && _2.default.tasks.default === undefined) {
        const menuRuleCollection = _consultant2.default.createRuleCollection({
            _: {
                type: String,
                label: 'Task',
                description: 'The task to be executed',
                values: _2.default.getTaskNames(),
                min: 0,
                max: undefined
            }
        });

        menuRuleCollection.inquiry().then(result => _2.default.exec(result.argv)).catch(err => {
            _maester2.default.error(err);
        });
    } else {
        _2.default.exec(argv).catch(err => {
            _maester2.default.error(err);
        });
    }
}