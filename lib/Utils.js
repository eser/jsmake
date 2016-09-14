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

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _child_process = require('child_process');

var _child_process2 = _interopRequireDefault(_child_process);

var _cofounder = require('cofounder');

var _cofounder2 = _interopRequireDefault(_cofounder);

var _semver = require('semver');

var _semver2 = _interopRequireDefault(_semver);

var _npm = require('npm');

var _npm2 = _interopRequireDefault(_npm);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Utils {
    constructor() {
        this.scanDir = _cofounder2.default.scanDir;
        this.glob = _cofounder2.default.glob;
        this.rm = _cofounder2.default.rm;
        this.rmdir = _cofounder2.default.rmdir;
        // TODO
        // this.mkdir = cofounder.mkdir;
        // this.cp = cofounder.cp;
        // this.mv = cofounder.mv;
    }

    shell(commands) {
        const commands_ = commands.constructor === Array ? commands : [commands];

        for (const command of commands_) {
            _child_process2.default.spawnSync(command, [], {
                stdio: 'inherit',
                shell: true
            });
        }
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
        _npm2.default.load({ loaded: false }, function (err) {
            if (err) {
                throw err;
            }

            _npm2.default.commands.publish();
        });
    }
}

exports.default = Utils;