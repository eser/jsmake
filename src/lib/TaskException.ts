import maester = require('maester');

export class TaskException extends maester.exception {
    constructor(input, exception = null) {
        super(input, exception);
    }
}

export default TaskException;
