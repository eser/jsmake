"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cofounder = require("cofounder");
const semver = require("semver");
class Utils extends cofounder.constructor {
    constructor(...args) {
        super(...args);
    }
    async packageJsonVersionBump(filepath, type = 'patch') {
        const packageContent = await this.json.loadFile(filepath);
        packageContent.version = semver.inc(packageContent.version, type);
        await this.json.saveFile(filepath, packageContent);
        return packageContent.version;
    }
    npmPublish() {
        this.shell('npm publish');
    }
}
exports.Utils = Utils;
exports.default = Utils;
//# sourceMappingURL=Utils.js.map