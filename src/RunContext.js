import { TaskException } from './TaskException.js';

export class RunContext {
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

        const preTaskName = `pre-${task.name}`,
            postTaskName = `post-${task.name}`;

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
        const parameters = (this.argv._.length > 0) ? this.argv._ : [ 'default' ];

        for (const taskKey of Object.keys(this.owner.tasks)) {
            const task = this.owner.tasks[taskKey],
                tasknameParts = task.name.split(' ');

            if (this.checkArrayIncludes(parameters, tasknameParts)) {
                parameters.splice(0, tasknameParts.length);

                return this.owner.tasks[taskKey];
            }
        }

        const command = parameters.join(' ');

        throw new TaskException({
            message: `unknown task - ${command}`,
            error: this.owner.errors.unknownCommand,
            command: command
        });
    }

    async runExecutionQueue() {
        let task;

        try {
            while (this.executionQueue.length > 0) {
                const taskname = this.executionQueue.shift();

                task = this.owner.tasks[taskname];

                this.owner.logger.debug('running task ${task.name}');

                await task.execute(this.argv);
            }
        }
        catch (ex) {
            throw new TaskException({
                message: 'exception is thrown during task execution',
                error: this.owner.errors.exception,
                exception: ex,
                task: task
            });
        }
    }

    async execute() {
        const task = this.validateArgvAndGetTask();

        this.addTask(task);

        await this.runExecutionQueue();
    }
}

export default RunContext;
