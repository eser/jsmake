/**
 * jsmake
 *
 * @version v0.0.1
 * @link http://eser.ozvataf.com
 */
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Utils = undefined;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _cofounder = require('cofounder');

var _cofounder2 = _interopRequireDefault(_cofounder);

var _semver = require('semver');

var _semver2 = _interopRequireDefault(_semver);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Utils {
    constructor() {
        // fs
        this.scanDir = _cofounder2.default.fs.scanDir;
        this.glob = _cofounder2.default.fs.glob;
        this.cp = _cofounder2.default.fs.cp;
        this.mv = _cofounder2.default.fs.mv;
        this.rm = _cofounder2.default.fs.rm;
        this.rmdir = _cofounder2.default.fs.rmdir;
        this.mkdir = _cofounder2.default.fs.mkdir;
        this.writeFile = _cofounder2.default.fs.writeFile;
        // os
        this.shell = _cofounder2.default.os.shell;
    }

    packageJsonLoad(filepath) {
        const packageFile = _fs2.default.readFileSync(filepath, { encoding: 'utf8' });

        const packageContent = JSON.parse(packageFile);

        return packageContent;
    }

    packageJsonSave(filepath, content) {
        _fs2.default.writeFileSync(filepath, JSON.stringify(content, null, '  '), { encoding: 'utf8' });
    }

    packageJsonVersionBump(filepath) {
        let type = arguments.length <= 1 || arguments[1] === undefined ? 'patch' : arguments[1];

        const packageContent = this.packageJsonLoad(filepath);

        packageContent.version = _semver2.default.inc(packageContent.version, type);

        this.packageJsonSave(filepath, packageContent);

        return packageContent.version;
    }

    npmPublish() {
        /*
        npm.load(
            { loaded: false },
            function (err) {
                if (err) {
                    throw err;
                }
                 npm.commands.publish();
            }
        );
        */
        this.shell('npm publish');
    }
}

exports.Utils = Utils;
exports.default = Utils;