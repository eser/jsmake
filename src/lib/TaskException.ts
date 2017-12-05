import { BaseException } from 'maester/lib/exceptions/BaseException';

export class TaskException extends BaseException {
    constructor(input, exception = null) {
        super(input, exception);
    }
}

export default TaskException;
