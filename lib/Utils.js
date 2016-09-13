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

var _child_process = require('child_process');

var _child_process2 = _interopRequireDefault(_child_process);

var _cofounder = require('cofounder');

var _cofounder2 = _interopRequireDefault(_cofounder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Utils {
    constructor() {
        this.scanDir = _cofounder2.default.scanDir;
        // TODO
        // this.glob = cofounder.glob;
        // this.mkdir = cofounder.mkdir;
        // this.rmdir = cofounder.rmdir;
        // this.cp = cofounder.cp;
        // this.mv = cofounder.mv;
        // this.rm = cofounder.rm;
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
}

exports.default = Utils;