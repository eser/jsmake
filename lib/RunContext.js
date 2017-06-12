"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var RunContext = (function () {
    function RunContext(consultantInstance) {
        this.executionQueue = [];
        this.consultantInstance = consultantInstance;
    }
    RunContext.prototype.enqueueCommand = function (commandSet, args) {
        return __awaiter(this, void 0, void 0, function () {
            var argv, commandLocation;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(args.constructor === Object)) return [3, 2];
                        return [4, this.consultantInstance.fromObject(args)];
                    case 1:
                        argv = _a.sent();
                        return [3, 4];
                    case 2: return [4, this.consultantInstance.fromString(args)];
                    case 3:
                        argv = _a.sent();
                        _a.label = 4;
                    case 4:
                        if (argv.commandId === undefined) {
                            throw new Error('enqueueCommand: argv.commandId is undefined');
                        }
                        commandLocation = commandSet.locatePath(argv.commandId);
                        if (commandLocation === null) {
                            throw new Error('enqueueCommand: commandLocation is null');
                        }
                        this.enqueueCommandDirect(commandSet, commandLocation, {
                            command: commandLocation.instance,
                            argv: argv
                        });
                        return [2];
                }
            });
        });
    };
    RunContext.prototype.enqueueCommandDirect = function (commandSet, commandLocation, state) {
        if (this.executionQueue.some(function (item) { return item.command === commandLocation.instance; })) {
            return;
        }
        var command = commandLocation.instance;
        if (command.prerequisites !== undefined) {
            for (var _i = 0, _a = command.prerequisites; _i < _a.length; _i++) {
                var prerequisite = _a[_i];
                var prerequisiteLocation = commandSet.locatePath(prerequisite);
                if (prerequisiteLocation === null) {
                    throw new Error("prerequisite " + prerequisite + " is not found for task " + command.name);
                }
                this.enqueueCommandDirect(commandSet, prerequisiteLocation, state);
            }
        }
        this.executionQueue.push(state);
    };
    RunContext.prototype.executeSingle = function (state) {
        return __awaiter(this, void 0, void 0, function () {
            var result, command, ret, ex_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        command = state.command;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        if (!(command.action !== undefined || command.prerequisites.length === 0)) return [3, 3];
                        ret = command.action(state.argv, process.stdout);
                        if (!(ret instanceof Promise)) return [3, 3];
                        return [4, ret];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        result = Promise.resolve();
                        return [3, 5];
                    case 4:
                        ex_1 = _a.sent();
                        result = Promise.reject(ex_1);
                        return [3, 5];
                    case 5: return [2, result];
                }
            });
        });
    };
    RunContext.prototype.execute = function () {
        return __awaiter(this, void 0, void 0, function () {
            var state;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.executionQueue.length > 0)) return [3, 2];
                        state = this.executionQueue.shift();
                        return [4, this.executeSingle(state)];
                    case 1:
                        _a.sent();
                        return [3, 0];
                    case 2: return [2];
                }
            });
        });
    };
    return RunContext;
}());
exports.RunContext = RunContext;
exports.default = RunContext;
//# sourceMappingURL=RunContext.js.map