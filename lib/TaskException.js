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

var _maester = require('maester');

var _maester2 = _interopRequireDefault(_maester);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class TaskException extends _maester2.default.exception {}
exports.default = TaskException;