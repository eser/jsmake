import * as maester from 'maester';

export class TaskException extends maester.exception {
    constructor(input, exception = null) {
        super(input, exception);
    }
}

export default TaskException;
