"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const esm_1 = require("maester/lib/esm");
const esm_2 = require("senior/lib/esm");
const assign_1 = require("ponyfills/lib/assign");
const CommandSet_1 = require("./CommandSet");
const Utils_1 = require("./Utils");
const pkg = require("../package.json");
const emptyDescription = '';
class JsMake extends CommandSet_1.CommandSet {
    constructor() {
        super();
        this.lastDescription = emptyDescription;
        this.outputStream = process.stdout;
        this.logger = new esm_1.Maester();
        this.logger.logging.addLogger('stream', 'stream', 'basic', this.outputStream);
        this.plugins = new esm_2.Senior('jsmake');
        this.utils = new Utils_1.Utils();
        this.errors = {
            unknownCommand: Symbol('unknown command'),
            exception: Symbol('exception thrown')
        };
    }
    loadPlugins() {
        this.logger.debug('loading plugins...');
        this.plugins.loadAll({ jsmake: this });
    }
    loadFile(filepath) {
        this.logger.debug(`loading makefile '${filepath}'...`);
        const loadedModule = this.plugins.loadFile(filepath, { jsmake: this });
        return loadedModule;
    }
    desc(description) {
        this.lastDescription = description;
    }
    task(pathstr, ...params) {
        let paramCount = params.length;
        const lastParam = params[paramCount - 1];
        let options;
        if (lastParam.constructor !== Function && lastParam instanceof Object) {
            options = assign_1.assign({}, lastParam);
            paramCount--;
        }
        else {
            options = {};
        }
        if (this.lastDescription !== emptyDescription) {
            options.description = this.lastDescription;
        }
        this.lastDescription = emptyDescription;
        if (paramCount >= 2) {
            options.prerequisites = params[0];
            options.action = params[1];
        }
        else if (paramCount >= 1) {
            options.prerequisites = [];
            options.action = params[0];
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