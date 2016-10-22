/**
 * jsmake
 *
 * @version v0.0.1
 * @link http://eser.ozvataf.com
 */
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.JsMake = undefined;

var _es6Eventemitter = require('es6-eventemitter');

var _es6Eventemitter2 = _interopRequireDefault(_es6Eventemitter);

var _maester = require('maester');

var _maester2 = _interopRequireDefault(_maester);

var _senior = require('senior');

var _senior2 = _interopRequireDefault(_senior);

var _Task = require('./Task.js');

var _RunContext = require('./RunContext.js');

var _Utils = require('./Utils.js');

var _alignedString = require('./utils/alignedString.js');

var _package = require('../package.json');

var _package2 = _interopRequireDefault(_package);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

const emptyDescription = '';

class JsMake {
    constructor() {
        this.events = new _es6Eventemitter2.default();
        this.logger = _maester2.default;
        this.plugins = new _senior2.default('jsmake');
        this.utils = new _Utils.Utils();

        this.errors = {
            unknownTask: Symbol('unknown task'),
            exception: Symbol('exception thrown')
        };

        this.tasks = {};
        this.description = emptyDescription;
    }

    loadFile(filepath) {
        _maester2.default.debug(`loading makefile '${ filepath }'...`);
        require(filepath);
    }

    createTask() {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return new (Function.prototype.bind.apply(_Task.Task, [null].concat(args)))();
    }

    createRunContext() {
        for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            args[_key2] = arguments[_key2];
        }

        return new (Function.prototype.bind.apply(_RunContext.RunContext, [null].concat([this], args)))();
    }

    desc(description) {
        this.description = description;
    }

    task(p1, p2, p3) {
        // p1 as task instance
        if (p1 instanceof _Task.Task) {
            this.tasks[p1.name] = p1;

            if (p1.description === undefined) {
                this.tasks[p1.name].setDescription(this.description);
            }
            this.description = emptyDescription;

            return this.tasks[p1.name];
        }

        // p1 as taskname string, p2 as action
        if (p2 !== undefined && p2.constructor === Function) {
            this.tasks[p1] = new _Task.Task(p1, this.description, undefined, undefined, p2);
            this.description = emptyDescription;

            return this.tasks[p1];
        }

        // p1 as taskname string, p2 as prerequisites, p3 as action
        this.tasks[p1] = new _Task.Task(p1, this.description, undefined, p2, p3);
        this.description = emptyDescription;

        return this.tasks[p1];
    }

    exec(argv) {
        var _this = this;

        return _asyncToGenerator(function* () {
            const runContext = _this.createRunContext(argv);

            yield runContext.execute();

            return runContext;
        })();
    }

    getTaskNames() {
        return Object.keys(this.tasks).map(taskKey => this.tasks[taskKey].name);
    }

    getVersion() {
        return _package2.default.version;
    }

    help(output) {
        let indent = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

        output.push((0, _alignedString.alignedString)([indent, 'Tasks                            Description                        ']));
        output.push((0, _alignedString.alignedString)([indent, '-------------------------------  -----------------------------------']));

        this.tasks.forEach(task => {
            output.push((0, _alignedString.alignedString)([indent, task.name, 35, task.description]));

            task.parameters.help(output, [indent + 4, 35]);
        });
    }
}

exports.JsMake = JsMake;
exports.default = JsMake;