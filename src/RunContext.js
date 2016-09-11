import yargsParser from 'yargs-parser';

class RunContext {
    constructor(owner) {
        this.owner = owner;

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
        for (let prerequisite of task.prerequisites) {
            const prerequisiteTask = this.owner.tasks[prerequisite];

            this.addTask(prerequisiteTask);
        }

        if (this.executionQueue.indexOf(task.name) >= 0) {
            return;
        }

        this.executionQueue.push(task.name);
    }

    async execute() {
        while (this.executionQueue.length > 0) {
            const taskname = this.executionQueue.shift();

            const ret = this.owner.tasks[taskname].callback(this);

            if (ret instanceof Promise) {
                await ret;
            }
        }
    }
}

export default RunContext;
