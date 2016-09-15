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
}

exports.default = Task;