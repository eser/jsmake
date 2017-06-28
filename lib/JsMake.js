"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EventEmitter = require("es6-eventemitter");
const maester = require("maester");
const Senior = require("senior");
const ponyfills_1 = require("ponyfills");
const CommandSet_1 = require("./CommandSet");
const Utils_1 = require("./Utils");
const pkg = require("../package.json");
const emptyDescription = '';
class JsMake extends CommandSet_1.CommandSet {
    constructor() {
        super();
        this.events = new EventEmitter();
        this.logger = maester;
        this.plugins = new Senior('jsmake');
        this.utils = new Utils_1.Utils();
        this.errors = {
            unknownCommand: Symbol('unknown command'),
            exception: Symbol('exception thrown')
        };
        this.lastDescription = emptyDescription;
    }
    loadPlugins() {
        maester.debug('loading plugins...');
        this.plugins.loadAll({ jsmake: this });
    }
    loadFile(filepath) {
        maester.debug(`loading makefile '${filepath}'...`);
        const jsmakeBackup = global.jsmake;
        global.jsmake = this;
        try {
            const loadedModule = require(filepath);
            return loadedModule;
        }
        catch (ex) {
            if (ex.code !== 'MODULE_NOT_FOUND') {
                throw ex;
            }
        }
        global.jsmake = jsmakeBackup;
        return null;
    }
    desc(description) {
        this.lastDescription = description;
    }
    task(pathstr, ...params) {
        let paramCount = params.length;
        const lastParam = params[paramCount - 1];
        let options;
        if (lastParam.constructor !== Function && lastParam instanceof Object) {
            options = ponyfills_1.assign({}, lastParam);
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
    }
    getVersion() {
        return pkg.version;
    }
}
exports.JsMake = JsMake;
exports.default = JsMake;
//# sourceMappingURL=JsMake.js.map