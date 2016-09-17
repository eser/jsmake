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

var _ArgvList = require('./ArgvList.js');

var _ArgvList2 = _interopRequireDefault(_ArgvList);

var _Utils = require('./Utils.js');

var _Utils2 = _interopRequireDefault(_Utils);

var _package = require('../package.json');

var _package2 = _interopRequireDefault(_package);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

const emptyDescription = '';

class JsMake {
    constructor() {
        this.events = new _events2.default.EventEmitter();
        this.logger = _maester2.default;
        this.utils = new _Utils2.default();

        this.errors = {
            unknownTask: Symbol('unknown task'),
            taskValidationFailed: Symbol('task validation failed'),
            exception: Symbol('exception thrown')
        };

        this.tasks = {};
        this.description = emptyDescription;

        this.argvList = new _ArgvList2.default({
            'makefile': {
                aliases: ['f'],
                type: String,
                parameter: 'FILE',
                description: 'Load tasks from FILE.',
                min: 0,
                max: undefined,
                'default': ['makefile.js']
            },
            'tasks': {
                type: Boolean,
                aliases: ['t'],
                description: 'Lists defined tasks.',
                min: 0,
                max: 1,
                'default': false
            },
            'quiet': {
                type: Boolean,
                aliases: ['q'],
                description: 'Turns off output of non-critical log messages.',
                min: 0,
                max: 1,
                'default': false
            },
            'version': {
                type: Boolean,
                aliases: ['v'],
                description: 'Displays the jsmake version.',
                min: 0,
                max: 1,
                'default': false
            },
            'help': {
                type: Boolean,
                aliases: ['h', '?'],
                description: 'Displays this help message.',
                min: 0,
                max: 1,
                'default': false
            }
        });
    }

    loadFile(filepath) {
        require(filepath);
    }

    createTask() {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return new (Function.prototype.bind.apply(_Task2.default, [null].concat(args)))();
    }

    createRunContext() {
        for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            args[_key2] = arguments[_key2];
        }

        return new (Function.prototype.bind.apply(_RunContext2.default, [null].concat([this], args)))();
    }

    desc(description) {
        this.description = description;
    }

    task(p1, p2, p3) {
        // p1 as task instance
        if (p1 instanceof _Task2.default) {
            this.tasks[p1.name] = p1;

            if (p1.description === undefined) {
                this.tasks[p1.name].setDescription(this.description);
            }
            this.description = emptyDescription;

            return this.tasks[p1.name];
        }

        // p1 as taskname string, p2 as action
        if (p2 !== undefined && p2.constructor === Function) {
            this.tasks[p1] = new _Task2.default(p1, this.description, undefined, undefined, p2);
            this.description = emptyDescription;

            return this.tasks[p1];
        }

        // p1 as taskname string, p2 as prerequisites, p3 as action
        this.tasks[p1] = new _Task2.default(p1, this.description, undefined, p2, p3);
        this.description = emptyDescription;

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

    getHelp() {
        const output = ['Usage: jsmake [command] [parameters]', ''];

        for (const line of this.argvList.help()) {
            output.push(line);
        }

        output.push('');
        output.push(' Tasks                           Description');
        output.push(' ------------------------------  -----------------------------------');

        for (const key in this.tasks) {
            const task = this.tasks[key];

            let lineOutput = ` ${ task.name }`;

            output.push(`${ lineOutput }${ ' '.repeat(32 - lineOutput.length) } ${ task.description }`);

            if (task.parameters !== undefined) {
                const parametersHelp = task.parameters.help();

                if (parametersHelp.length > 0) {
                    output.push('   Parameters:');
                    for (const line of parametersHelp) {
                        output.push(`   ${ line }`);
                    }
                    output.push('');
                }
            }
        }

        return output;
    }
}

const instance = new JsMake();

if (global.jsmake === undefined) {
    global.jsmake = instance;
}

module.exports = instance;