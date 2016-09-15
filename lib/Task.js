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

var _maester = require('maester');

var _maester2 = _interopRequireDefault(_maester);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

class Task {
    static notAssigned() {
        throw new Error('task\'s action is not assigned');
    }

    constructor(owner, name, prerequisites, action) {
        this.owner = owner;
        this.name = name;

        this.events = new _events2.default.EventEmitter();
        this.logger = _maester2.default;

        if (prerequisites === undefined) {
            this.prerequisites = [];
            this.action = this.constructor.notAssigned;
        } else {
            if (action === undefined) {
                this.prerequisites = [];
                this.action = prerequisites;
            } else {
                this.prerequisites = prerequisites;
                this.action = action;
            }
        }
    }

    setPrerequisites(prerequisites) {
        this.prerequisites = prerequisites;
    }

    setAction(action) {
        this.action = action;
    }

    validate(argv) {
        return true;
    }

    help() {}

    execute(argv) {
        var _this = this;

        return _asyncToGenerator(function* () {
            const action = _this.action.bind(_this);

            try {
                const ret = action(argv);

                if (ret instanceof Promise) {
                    yield ret;
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