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
var Command_1 = require("./Command");
var RunContext_1 = require("./RunContext");
var CommandSet = (function () {
    function CommandSet() {
    }
    CommandSet.prototype.locateCommandSet = function (pathstr) {
        var split = pathstr.split(' ');
        var pointer = this;
        while (split.length > 1) {
            var name_1 = split.shift();
            pointer = pointer[name_1];
            if (pointer === undefined) {
                return pointer;
            }
        }
        return {
            parent: pointer,
            name: split[0]
        };
    };
    CommandSet.prototype.locateCommand = function (pathstr) {
        var target = this.locateCommandSet(pathstr);
        return target.parent[target.name];
    };
    CommandSet.prototype.createCommandSet = function (pathstr) {
        var split = pathstr.split(' ');
        var pointer = this;
        while (split.length > 1) {
            var name_2 = split.shift();
            if (!(name_2 in pointer)) {
                pointer[name_2] = new CommandSet();
            }
            pointer = pointer[name_2];
        }
        return {
            parent: pointer,
            name: split[0]
        };
    };
    CommandSet.prototype.createCommand = function (pathstr, options) {
        var target = this.createCommandSet(pathstr);
        var command = Object.assign(new Command_1.Command(target.name, undefined), options);
        target.parent[target.name] = command;
        return command;
    };
    CommandSet.prototype.exec = function (argv) {
        return __awaiter(this, void 0, void 0, function () {
            var runContext, args;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        runContext = new RunContext_1.RunContext();
                        args = argv._.join(' ');
                        runContext.enqueueCommand(this, args, { argv: argv });
                        return [4, runContext.execute()];
                    case 1:
                        _a.sent();
                        return [2, runContext];
                }
            });
        });
    };
    CommandSet.prototype.menu = function () {
    };
    CommandSet.prototype.help = function () {
    };
    return CommandSet;
}());
exports.CommandSet = CommandSet;
;
exports.default = CommandSet;
//# sourceMappingURL=CommandSet.js.map