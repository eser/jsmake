"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const esm_1 = require("maester/lib/esm");
class TaskException extends esm_1.BaseException {
    constructor(input, exception = null) {
        super(input, exception);
    }
}
exports.TaskException = TaskException;
exports.default = TaskException;
//# sourceMappingURL=TaskException.js.map