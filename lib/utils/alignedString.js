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
exports.alignedString = alignedString;
function alignedString(input) {
    let initial = arguments.length <= 1 || arguments[1] === undefined ? '' : arguments[1];

    let output = initial;

    while (input.length >= 2) {
        const pos = input.shift();

        if (output.length < pos) {
            output += ' '.repeat(pos - output.length);
        }

        output += input.shift();
    }

    return output;
}

exports.default = alignedString;