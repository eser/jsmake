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
var maester = require("maester");
var consultant = require("consultant");
var Senior = require("senior");
var CommandSet_1 = require("./CommandSet");
var Utils_1 = require("./Utils");
var alignedString_1 = require("./utils/alignedString");
var pkg = require("../package.json");
var emptyDescription = '';
var JsMake = (function () {
    function JsMake() {
        this.events = new EventEmitter();
        this.logger = maester;
        this.tasks = new CommandSet_1.CommandSet();
        this.plugins = new Senior('jsmake');
        this.utils = new Utils_1.Utils();
        this.errors = {
            unknownCommand: Symbol('unknown command'),
            exception: Symbol('exception thrown')
        };
        this.description = emptyDescription;
    }
    JsMake.prototype.loadPlugins = function () {
        maester.debug('loading plugins...');
        var plugins = this.plugins.loadAll({ jsmake: this });
    };
    JsMake.prototype.loadFile = function (filepath) {
        maester.debug("loading makefile '" + filepath + "'...");
        var jsmakeBackup = global.jsmake;
        global.jsmake = this;
        try {
            var loadedModule = require(filepath);
            return loadedModule;
        }
        catch (ex) {
            if (ex.code !== 'MODULE_NOT_FOUND') {
                throw ex;
            }
        }
        global.jsmake = jsmakeBackup;
        return null;
    };
    JsMake.prototype.desc = function (description) {
        this.description = description;
    };
    JsMake.prototype.task = function (name) {
        var params = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            params[_i - 1] = arguments[_i];
        }
        var paramCount = params.length;
        var lastParam = params[paramCount - 1];
        var options;
        if (lastParam.constructor !== Function && lastParam instanceof Object) {
            options = Object.assign({}, lastParam);
            paramCount--;
        }
        else {
            options = {};
        }
        if (this.description !== emptyDescription) {
            options.description = this.description;
        }
        this.description = emptyDescription;
        if (paramCount === 1) {
            options.action = params[0];
        }
        else {
            options.prerequisites = params[0];
            options.action = params[1];
        }
        var command = this.tasks.createCommand(name, options);
        return command;
    };
    JsMake.prototype.getVersion = function () {
        return pkg.version;
    };
    JsMake.prototype.help = function (output, indent) {
        if (indent === void 0) { indent = 0; }
        output.push(alignedString_1.alignedString([indent, 'Tasks                            Description                        ']));
        output.push(alignedString_1.alignedString([indent, '-------------------------------  -----------------------------------']));
    };
    JsMake.prototype.menu = function () {
        return __awaiter(this, void 0, void 0, function () {
            var menuItems, taskRules, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        menuItems = [];
                        taskRules = {
                            _: {
                                type: String,
                                label: 'Task',
                                description: 'The task to be executed',
                                values: menuItems,
                                cancelValue: {
                                    name: 'Quit',
                                    value: null,
                                    'short': 'Quit'
                                },
                                min: 0,
                                max: undefined
                            }
                        };
                        return [4 /*yield*/, consultant.input.fromInquiry(taskRules)];
                    case 1:
                        result = _a.sent();
                        if (!(result instanceof Object)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.tasks.exec(result.argv)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, true];
                    case 3: return [2 /*return*/, false];
                }
            });
        });
    };
    return JsMake;
}());
exports.JsMake = JsMake;
exports.default = JsMake;
//# sourceMappingURL=JsMake.js.map