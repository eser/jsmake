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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t;
    return { next: verb(0), "throw": verb(1), "return": verb(2) };
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
var EventEmitter = require("es6-eventemitter");
var consultant = require("consultant");
var TaskException_1 = require("./TaskException");
function notAssigned(argv, argValidated) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            throw new TaskException_1.TaskException('task\'s action is not assigned');
        });
    });
}
exports.notAssigned = notAssigned;
;
var Command = (function () {
    function Command(name, description, parameters, prerequisites, action) {
        if (parameters === void 0) { parameters = []; }
        if (prerequisites === void 0) { prerequisites = []; }
        if (action === void 0) { action = notAssigned; }
        this.events = new EventEmitter();
        this.name = name;
        this.description = description;
        this.parameters = parameters;
        this.prerequisites = prerequisites;
        this.action = action;
        this.menuHidden = false;
    }
    Command.prototype.setParameter = function (name, options) {
        if (this.parameters === undefined) {
            this.parameters = [];
        }
        this.parameters[name] = options;
    };
    Command.prototype.execute = function (state) {
        return __awaiter(this, void 0, void 0, function () {
            var argValidated, ret, ex_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        if (!(this.action !== notAssigned || this.prerequisites.length === 0)) return [3 /*break*/, 2];
                        argValidated = void 0;
                        if (this.parameters !== undefined) {
                            argValidated = consultant.input.fromObject(this.parameters, state.argv);
                        }
                        ret = this.action(state.argv, argValidated);
                        if (!(ret instanceof Promise)) return [3 /*break*/, 2];
                        return [4 /*yield*/, ret];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        this.events.emit('done');
                        return [3 /*break*/, 4];
                    case 3:
                        ex_1 = _a.sent();
                        this.events.emit('error', ex_1);
                        return [3 /*break*/, 4];
                    case 4:
                        this.events.emit('complete');
                        return [2 /*return*/];
                }
            });
        });
    };
    return Command;
}());
exports.Command = Command;
;
exports.default = Command;
//# sourceMappingURL=Command.js.map