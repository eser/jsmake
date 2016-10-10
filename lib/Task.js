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

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

var _consultant = require('consultant');

var _consultant2 = _interopRequireDefault(_consultant);

var _TaskException = require('./TaskException.js');

var _TaskException2 = _interopRequireDefault(_TaskException);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

class Task {
    static notAssigned() {
        return _asyncToGenerator(function* () {
            throw new _TaskException2.default('task\'s action is not assigned');
        })();
    }

    static from(source) {
        const task = new this(source.name, source.description, undefined, undefined, undefined);

        return Object.assign(task, source);
    }

    constructor(name, description, parameters, prerequisites, action) {
        this.events = new _events2.default.EventEmitter();

        this.name = name;
        this.description = description;

        if (parameters === undefined) {
            this.parameters = _consultant2.default.createRuleCollection();
        } else {
            this.parameters = parameters;
        }

        if (prerequisites === undefined) {
            this.prerequisites = [];
        } else {
            this.prerequisites = prerequisites;
        }

        if (action === undefined) {
            this.action = this.constructor.notAssigned;
        } else {
            this.action = action;
        }
    }

    setDescription(description) {
        this.description = description;
    }

    setParameters(parameters) {
        this.parameters = parameters;
    }

    setPrerequisites(prerequisites) {
        this.prerequisites = prerequisites;
    }

    setAction(action) {
        this.action = action;
    }

    execute(argv) {
        var _this = this;

        return _asyncToGenerator(function* () {
            try {
                if (_this.action !== _this.constructor.notAssigned || _this.prerequisites.length === 0) {
                    const argValidated = _this.parameters.validate(argv),
                          ret = _this.action(argv, argValidated);

                    if (ret instanceof Promise) {
                        yield ret;
                    }
                }

                _this.events.emit('done');
            } catch (ex) {
                _this.events.emit('error', ex);
            }

            _this.events.emit('complete');
        })();
    }
}
exports.default = Task;