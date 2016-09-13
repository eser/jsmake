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

class Task {
    static notAssigned() {
        throw new Error('task\'s callback is not assigned');
    }

    constructor(owner, name, prerequisites, callback) {
        this.owner = owner;
        this.name = name;

        this.events = new _events2.default.EventEmitter();
        this.logger = _maester2.default;

        if (prerequisites === undefined) {
            this.prerequisites = [];
            this.callback = this.constructor.notAssigned;
        } else {
            if (callback === undefined) {
                this.prerequisites = [];
                this.callback = prerequisites;
            } else {
                this.prerequisites = prerequisites;
                this.callback = callback;
            }
        }
    }

    setPrerequisites(prerequisites) {
        this.prerequisites = prerequisites;
    }

    setCallback(callback) {
        this.callback = callback;
    }

    validate(argv) {
        return true;
    }

    help() {}
}

exports.default = Task;