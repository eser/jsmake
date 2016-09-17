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

var _package = require('../package.json');

var _package2 = _interopRequireDefault(_package);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

class JsMake {
    constructor() {
        this.events = new _events2.default.EventEmitter();
        this.tasks = {};
        this.logger = _maester2.default;
        this.utils = new _Utils2.default();

        this.errors = {
            unknownTask: Symbol('unknown task'),
            taskValidationFailed: Symbol('task validation failed'),
            exception: Symbol('exception thrown')
        };
    }

    loadFile(filepath) {
        require(filepath);
    }

    createTask() {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return new (Function.prototype.bind.apply(_Task2.default, [null].concat([this], args)))();
    }

    createRunContext() {
        for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            args[_key2] = arguments[_key2];
        }

        return new (Function.prototype.bind.apply(_RunContext2.default, [null].concat([this], args)))();
    }

    task(p1, p2, p3) {
        // p1 as task instance
        if (p1 instanceof _Task2.default) {
            this.tasks[p1.name] = p1;

            return this.tasks[p1.name];
        }

        // p1 as object instance
        if (p1.constructor !== Array && p1.constructor !== Function && p1 instanceof Object) {
            this.tasks[p1.name] = Object.assign(new _Task2.default(this), p1);

            return this.tasks[p1.name];
        }

        // p1 as taskname string, p2 as action
        if (p3 === undefined) {
            this.tasks[p1] = new _Task2.default(this, p1, [], p2);

            return this.tasks[p1];
        }

        // p1 as taskname string, p2 as prerequisites, p3 as action
        this.tasks[p1] = new _Task2.default(this, p1, p2, p3);

        return this.tasks[p1];
    }

    exec(args) {
        var _this = this;

        return _asyncToGenerator(function* () {
            const runContext = _this.createRunContext();

            runContext.setArgs(args);

            return yield runContext.execute();
        })();
    }

    getTaskNames() {
        return Object.keys(this.tasks).map(task => this.tasks[task].name);
    }

    getVersion() {
        return _package2.default.version;
    }
}

const instance = new JsMake();

if (global.jsmake === undefined) {
    global.jsmake = instance;
}

module.exports = instance;