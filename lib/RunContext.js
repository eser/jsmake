/**
 * jsmake
 *
 * @version v0.0.1
 * @link http://eser.ozvataf.com
 */
"use strict";

class RunContext {
    constructor(owner, argv) {
        this.owner = owner;
        this.argv = argv;

        this.executionQueue = [];
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
        while (this.executionQueue.length > 0) {
            const taskname = this.executionQueue.shift();

            this.owner.tasks[taskname].callback(this);
        }
    }
}

module.exports = RunContext;