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
exports.RunContext = undefined;

var _TaskException = require('./TaskException.js');

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

class RunContext {
    constructor(owner, argv) {
        this.owner = owner;
        this.argv = argv;

        this.executionQueue = [];
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

    checkArrayIncludes(array1, array2) {
        if (array1.length < array2.length) {
            return false;
        }

        for (let i = 0; i < array2.length; i++) {
            if (array1[i] !== array2[i]) {
                return false;
            }
        }

        return true;
    }

    validateArgvAndGetTask() {
        const parameters = this.argv._.length > 0 ? this.argv._ : ['default'];

        for (const taskKey of Object.keys(this.owner.tasks)) {
            const task = this.owner.tasks[taskKey],
                  tasknameParts = task.name.split(' ');

            if (this.checkArrayIncludes(parameters, tasknameParts)) {
                parameters.splice(0, tasknameParts.length);

                return this.owner.tasks[taskKey];
            }
        }

        throw new _TaskException.TaskException({
            message: `unknown task name - ${ parameters[0] }`,
            error: this.owner.errors.unknownTask,
            taskname: parameters[0]
        });
    }

    runExecutionQueue() {
        var _this = this;

        return _asyncToGenerator(function* () {
            let task;

            try {
                while (_this.executionQueue.length > 0) {
                    const taskname = _this.executionQueue.shift();

                    task = _this.owner.tasks[taskname];

                    _this.owner.logger.debug('running task ${task.name}');

                    yield task.execute(_this.argv);
                }
            } catch (ex) {
                throw new _TaskException.TaskException({
                    message: 'exception is thrown during task execution',
                    error: _this.owner.errors.exception,
                    exception: ex,
                    task: task
                });
            }
        })();
    }

    execute() {
        var _this2 = this;

        return _asyncToGenerator(function* () {
            const task = _this2.validateArgvAndGetTask();

            _this2.addTask(task);

            yield _this2.runExecutionQueue();
        })();
    }
}

exports.RunContext = RunContext;
exports.default = RunContext;