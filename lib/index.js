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

class JsMake {
    constructor() {
        this.events = new _events2.default.EventEmitter();
        this.tasks = {};
        this.logger = _maester2.default;
        this.utils = new _Utils2.default();

        this.errors = {
            unknown_task: Symbol('unknown task'),
            task_validation_failed: Symbol('task validation failed')
        };
    }

    loadFile(filepath) {
        require(filepath);
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

    createRunContext() {
        return new _RunContext2.default(this);
    }

    exec(args) {
        var _this = this;

        return _asyncToGenerator(function* () {
            const runContext = _this.createRunContext();

            runContext.setArgs(args);

            return yield runContext.execute();
        })();
    }

    help() {
        this.logger.info('Usage: jsmake [command]');
    }
}

const instance = new JsMake();

if (global.jsmake === undefined) {
    global.jsmake = instance;
}

module.exports = instance;