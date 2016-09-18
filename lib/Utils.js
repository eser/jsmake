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

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

var _child_process = require('child_process');

var _child_process2 = _interopRequireDefault(_child_process);

var _cofounder = require('cofounder');

var _cofounder2 = _interopRequireDefault(_cofounder);

var _semver = require('semver');

var _semver2 = _interopRequireDefault(_semver);

var _yargsParser = require('yargs-parser');

var _yargsParser2 = _interopRequireDefault(_yargsParser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Utils {
    constructor() {
        this.scanDir = _cofounder2.default.scanDir;
        this.glob = _cofounder2.default.glob;
        this.rm = _cofounder2.default.rm;
        this.rmdir = _cofounder2.default.rmdir;
        this.mkdir = _cofounder2.default.mkdir;
        // TODO
        // this.cp = cofounder.cp;
        // this.mv = cofounder.mv;
    }

    parseArgv(args, options) {
        return (0, _yargsParser2.default)(args, options); // .replace('  ', ' ')
    }

    shell(command) {
        let args = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];
        let env = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

        const env_ = Object.assign({}, process.env, env);

        const proc = _child_process2.default.spawnSync(command, args, {
            stdio: 'inherit',
            shell: true,
            env: env_,
            encoding: 'utf8'
        });

        process.on('SIGTERM', () => proc.kill('SIGTERM'));

        return proc;
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

exports.default = Utils;