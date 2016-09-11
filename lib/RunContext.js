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

var _yargsParser = require('yargs-parser');

var _yargsParser2 = _interopRequireDefault(_yargsParser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

class RunContext {
    constructor(owner) {
        this.owner = owner;

        this.executionQueue = [];
    }

    setArgv(argv) {
        this.argv = argv;
    }

    setArgs(args) {
        const argv = (0, _yargsParser2.default)(args); // .replace('  ', ' ')

        this.setArgv(argv);
    }

    addTask(task) {
        for (let prerequisite of task.prerequisites) {
            const prerequisiteTask = this.owner.tasks[prerequisite];

            this.addTask(prerequisiteTask);
        }

        if (this.executionQueue.indexOf(task.name) >= 0) {
            return;
        }

        this.executionQueue.push(task.name);
    }

    execute() {
        var _this = this;

        return _asyncToGenerator(function* () {
            while (_this.executionQueue.length > 0) {
                const taskname = _this.executionQueue.shift();

                const ret = _this.owner.tasks[taskname].callback(_this);

                if (ret instanceof Promise) {
                    yield ret;
                }
            }
        })();
    }
}

exports.default = RunContext;