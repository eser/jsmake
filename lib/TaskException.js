"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const maester = require("maester");
class TaskException extends maester.exception {
    constructor(input, exception = null) {
        super(input, exception);
    }
}
exports.TaskException = TaskException;
exports.default = TaskException;
//# sourceMappingURL=TaskException.js.map