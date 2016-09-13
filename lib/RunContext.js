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

var _maester = require('maester');

var _maester2 = _interopRequireDefault(_maester);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

class RunContext {
    constructor(owner) {
        this.owner = owner;
        this.logger = _maester2.default;

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
        for (const prerequisite of task.prerequisites) {
            const prerequisiteTask = this.owner.tasks[prerequisite];

            this.addTask(prerequisiteTask);
        }

        if (this.executionQueue.indexOf(task.name) >= 0) {
            return;
        }

        const preTaskName = `pre-${ task.name }`,
              postTaskName = `post-${ task.name }`;

        if (preTaskName in this.owner.tasks) {
            this.addTask(this.owner.tasks[preTaskName]);
        }

        this.executionQueue.push(task.name);

        if (postTaskName in this.owner.tasks) {
            this.addTask(this.owner.tasks[postTaskName]);
        }
    }

    validateArgvAndGetTask() {
        let taskname;

        if (this.argv._.length === 0) {
            taskname = 'default';
        } else {
            taskname = this.argv._.shift();
        }

        if (!(taskname in this.owner.tasks)) {
            this.logger.error(`unknown task name - ${ taskname }`);

            return { error: this.owner.errors.unknownTask, taskname: taskname };
        }

        return { error: null, task: this.owner.tasks[taskname] };
    }

    runExecutionQueue() {
        var _this = this;

        return _asyncToGenerator(function* () {
            while (_this.executionQueue.length > 0) {
                const taskname = _this.executionQueue.shift(),
                      task = _this.owner.tasks[taskname],
                      callback = _this.owner.tasks[taskname].callback.bind(_this),
                      ret = callback(_this.argv);

                if (ret instanceof Promise) {
                    yield ret;
                }

                task.events.emit('complete');
            }
        })();
    }

    execute() {
        var _this2 = this;

        return _asyncToGenerator(function* () {
            try {
                const validateResult = _this2.validateArgvAndGetTask();

                if (validateResult.error !== null) {
                    return validateResult;
                }

                const task = validateResult.task;

                if (task.validate !== undefined && !task.validate(_this2.argv)) {
                    _this2.logger.error(`task validation failed - ${ task.name }`);

                    if (task.help !== undefined) {
                        task.help();
                    }

                    return { error: _this2.owner.errors.taskValidationFailed, task: task };
                }

                _this2.addTask(task);

                yield _this2.runExecutionQueue();

                return { error: null };
            } catch (ex) {
                _this2.logger.error(ex);

                return { error: _this2.owner.errors.exception, exception: ex };
            }
        })();
    }
}

exports.default = RunContext;