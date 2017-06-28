import { BaseException } from 'maester/lib/esm';

export class TaskException extends BaseException {
    constructor(input, exception = null) {
        super(input, exception);
    }
}

export default TaskException;
