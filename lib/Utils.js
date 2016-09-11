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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Utils {
    shell(commands) {
        const commands_ = commands.constructor === Array ? commands : [commands];

        for (let command of commands_) {
            _child_process2.default.spawnSync(command, [], {
                stdio: 'inherit',
                shell: true
            });
        }
    }

    // TODO mkdir
    // TODO rm
    // TODO cp
    // TODO mv
}

exports.default = Utils;