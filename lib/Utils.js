"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const semver = require("semver");
const cofounder = require("cofounder/lib/esm");
class Utils {
    constructor() {
        this.fs = cofounder.fs;
        this.json = cofounder.json;
        this.os = cofounder.os;
    }
    async packageJsonVersionBump(filepath, type = 'patch') {
        const packageContent = await this.json.loadFile(filepath);
        packageContent.version = semver.inc(packageContent.version, type);
        await this.json.saveFile(filepath, packageContent);
        return packageContent.version;
    }
    npmPublish() {
        this.os.shell('npm publish');
    }
}
exports.Utils = Utils;
exports.default = Utils;
//# sourceMappingURL=Utils.js.map