/**
 * jsmake
 *
 * @version v0.0.1
 * @link http://eser.ozvataf.com
 */
'use strict';

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

var _maester = require('maester');

var _maester2 = _interopRequireDefault(_maester);

var _Task = require('./Task.js');

var _Task2 = _interopRequireDefault(_Task);

var _RunContext = require('./RunContext.js');

var _RunContext2 = _interopRequireDefault(_RunContext);

var _Utils = require('./Utils.js');

var _Utils2 = _interopRequireDefault(_Utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

const errors = {
    no_arguments: Symbol('no arguments'),
    unknown_task: Symbol('unknown task'),
    task_validation_failed: Symbol('task validation failed')
};

class JsMake {
    constructor() {
        this.events = new _events2.default.EventEmitter();
        this.tasks = {};
        this.logger = _maester2.default;
        this.utils = new _Utils2.default();
    }

    loadFile(filepath) {
        const _jsmake = global.jsmake;

        global.jsmake = this;
        require(filepath);

        global.jsmake = _jsmake;
    }

    task(name, p1, p2) {
        // p1 as task instance
        if (p1.constructor !== Array && p1.constructor !== Function && p1 instanceof Object) {
            this.tasks[name] = p1;
        }
        // p1 as method
        else if (p2 === undefined) {
                this.tasks[name] = new _Task2.default(this, name, [], p1);
            }
            // p1 as prerequisites, p2 as method
            else {
                    this.tasks[name] = new _Task2.default(this, name, p1, p2);
                }
    }

    validateArgvAndGetTask(argv) {
        let taskname;

        if (argv._.length === 0) {
            taskname = 'default';
        } else {
            taskname = argv._.shift();
        }

        if (!(taskname in this.tasks)) {
            return { error: errors.unknown_task, taskname: taskname };
        }

        return { error: null, task: this.tasks[taskname] };
    }

    execRunContext(runContext) {
        var _this = this;

        return _asyncToGenerator(function* () {
            try {
                const validateResult = _this.validateArgvAndGetTask(runContext.argv);

                if (validateResult.error === errors.no_arguments) {
                    _this.help();

                    return null;
                }

                if (validateResult.error === errors.unknown_task) {
                    _this.logger.error(`unknown task name - ${ validateResult.taskname }`);

                    return null;
                }

                const task = validateResult.task;

                if (task.validate !== undefined && !task.validate(runContext.argv)) {
                    if (task.help !== undefined) {
                        task.help();
                    }

                    return null;
                }

                runContext.addTask(task);

                return yield runContext.execute();
            } catch (ex) {
                _this.logger.error(ex);
            }
        })();
    }

    exec(args) {
        var _this2 = this;

        return _asyncToGenerator(function* () {
            const runContext = new _RunContext2.default(_this2);

            runContext.setArgs(args);

            _this2.execRunContext(runContext);
        })();
    }

    help() {
        this.logger.info('Usage: jsmake [command]');
    }
}

module.exports = new JsMake();