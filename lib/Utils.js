"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const semver = require("semver");
const esm_1 = require("cofounder/lib/esm");
class Utils extends esm_1.CoFounder {
    constructor() {
        super();
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