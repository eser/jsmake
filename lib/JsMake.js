"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var EventEmitter = require("es6-eventemitter");
var maester = require("maester");
var Senior = require("senior");
var CommandSet_1 = require("./CommandSet");
var Utils_1 = require("./Utils");
var pkg = require("../package.json");
var emptyDescription = '';
var JsMake = (function (_super) {
    __extends(JsMake, _super);
    function JsMake() {
        var _this = _super.call(this) || this;
        _this.events = new EventEmitter();
        _this.logger = maester;
        _this.plugins = new Senior('jsmake');
        _this.utils = new Utils_1.Utils();
        _this.errors = {
            unknownCommand: Symbol('unknown command'),
            exception: Symbol('exception thrown')
        };
        _this.lastDescription = emptyDescription;
        return _this;
    }
    JsMake.prototype.loadPlugins = function () {
        maester.debug('loading plugins...');
        this.plugins.loadAll({ jsmake: this });
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
        this.lastDescription = description;
    };
    JsMake.prototype.task = function (pathstr) {
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
        if (this.lastDescription !== emptyDescription) {
            options.description = this.lastDescription;
        }
        this.lastDescription = emptyDescription;
        if (paramCount === 1) {
            options.prerequisites = [];
            options.action = params[0];
        }
        else {
            options.prerequisites = params[0];
            options.action = params[1];
        }
        this.addCommand(pathstr, options);
    };
    JsMake.prototype.getVersion = function () {
        return pkg.version;
    };
    return JsMake;
}(CommandSet_1.CommandSet));
exports.JsMake = JsMake;
exports.default = JsMake;
//# sourceMappingURL=JsMake.js.map