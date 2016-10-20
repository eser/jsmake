import { JsMake } from './JsMake.js';

const jsmake = new JsMake();

if (global.jsmake === undefined) {
    global.jsmake = jsmake;
}

module.exports = jsmake;
