"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseException_1 = require("maester/lib/exceptions/BaseException");
class TaskException extends BaseException_1.BaseException {
    constructor(input, exception = null) {
        super(input, exception);
    }
}
exports.TaskException = TaskException;
exports.default = TaskException;
//# sourceMappingURL=TaskException.js.map