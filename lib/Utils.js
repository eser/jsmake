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

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

class Utils extends _cofounder2.default.constructor {
    constructor() {
        super(...arguments);
    }

    packageJsonVersionBump(filepath) {
        var _arguments = arguments,
            _this = this;

        return _asyncToGenerator(function* () {
            let type = _arguments.length <= 1 || _arguments[1] === undefined ? 'patch' : _arguments[1];

            const packageContent = yield _this.json.loadFile(filepath);

            packageContent.version = _semver2.default.inc(packageContent.version, type);

            yield _this.json.saveFile(filepath, packageContent);

            return packageContent.version;
        })();
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