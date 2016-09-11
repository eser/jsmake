/**
 * jsmake
 *
 * @version v0.0.1
 * @link http://eser.ozvataf.com
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
class Task {
    constructor(owner, name, prerequisites, callback) {
        this.owner = owner;
        this.name = name;

        if (callback === undefined) {
            this.prerequisites = [];
            this.callback = prerequisites;
        } else {
            this.prerequisites = prerequisites;
            this.callback = callback;
        }
    }

    validate(argv) {
        return true;
    }

    help() {}
}

exports.default = Task;