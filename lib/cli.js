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

const logger = _maester2.default.addLogger('ConsoleLogger', 'info');

process.on('uncaughtException', err => {
    console.error(err.stack);
    exitCode = 1;
});

process.on('exit', () => {
    process.exit(exitCode);
});

(0, _updateNotifier2.default)({ pkg: _package2.default }).notify({ defer: false });

const runContext = _2.default.createRunContext();

runContext.setArgs(process.argv.slice(2));

if (runContext.argv.quiet || runContext.argv.q) {
    logger.minimumSeverity = 'warn';
}

if (runContext.argv.version || runContext.argv.v) {
    _2.default.version();
} else if (runContext.argv.help || runContext.argv.h) {
    _2.default.help();
} else {
    const makefilePath = runContext.argv.makefile || runContext.argv.f || 'makefile.js';

    _2.default.loadFile(_path2.default.join(process.cwd(), makefilePath));

    if (runContext.argv.tasks || runContext.argv.t) {
        _2.default.listTasks();
    } else {
        runContext.execute();
    }
}