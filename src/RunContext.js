import yargsParser from 'yargs-parser';
import maester from 'maester';

class RunContext {
    constructor(owner) {
        this.owner = owner;
        this.logger = maester;

        this.executionQueue = [];
    }

    setArgv(argv) {
        this.argv = argv;
    }

    setArgs(args) {
        const argv = yargsParser(args); // .replace('  ', ' ')

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

    validateArgvAndGetTask() {
        let taskname;

        if (this.argv._.length === 0) {
            taskname = 'default';
        }
        else {
            taskname = this.argv._.shift();
        }

        if (!(taskname in this.owner.tasks)) {
            this.logger.error(`unknown task name - ${taskname}`);

            return { error: this.owner.errors.unknownTask, taskname: taskname };
        }

        return { error: null, task: this.owner.tasks[taskname] };
    }

    async runExecutionQueue() {
        while (this.executionQueue.length > 0) {
            const taskname = this.executionQueue.shift();

            const callback = this.owner.tasks[taskname].callback.bind(this),
                ret = callback(this.argv);

            if (ret instanceof Promise) {
                await ret;
            }
        }
    }

    async execute() {
        try {
            const validateResult = this.validateArgvAndGetTask();

            if (validateResult.error !== null) {
                return validateResult;
            }

            const task = validateResult.task;

            if (task.validate !== undefined && !task.validate(this.argv)) {
                this.logger.error(`task validation failed - ${task.name}`);

                if (task.help !== undefined) {
                    task.help();
                }

                return { error: this.owner.errors.taskValidationFailed, task: task };
            }

            this.addTask(task);

            await this.runExecutionQueue();

            return { error: null };
        }
        catch (ex) {
            this.logger.error(ex);

            return { error: this.owner.errors.exception, exception: ex };
        }
    }
}

export default RunContext;
