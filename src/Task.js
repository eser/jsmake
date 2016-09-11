class Task {
    constructor(owner, name, prerequisites, callback) {
        this.owner = owner;
        this.name = name;

        if (callback === undefined) {
            this.prerequisites = [];
            this.callback = prerequisites;
        }
        else {
            this.prerequisites = prerequisites;
            this.callback = callback;
        }
    }

    validate(argv) {
        return true;
    }

    help() {
    }
}

export default Task;
