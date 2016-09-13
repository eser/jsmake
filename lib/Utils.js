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
}

exports.default = Utils;