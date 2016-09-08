/**
 * jsmake
 *
 * @version v0.0.1
 * @link http://eser.ozvataf.com
 */
'use strict';

const EventEmitter = require('events'),
      Maester = require('maester');

class JsMake extends EventEmitter {
    constructor() {
        super();
    }
}

const instance = new JsMake();
module.exports = instance;