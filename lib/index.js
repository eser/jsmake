/**
 * jsmake
 *
 * @version v0.0.1
 * @link http://eser.ozvataf.com
 */
'use strict';

var _JsMake = require('./JsMake.js');

const jsmake = new _JsMake.JsMake();

if (global.jsmake === undefined) {
    global.jsmake = jsmake;
}

module.exports = jsmake;