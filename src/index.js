const EventEmitter = require('events'),
    Maester = require('maester');

class JsMake extends EventEmitter {
    constructor() {
        super();
    }
}

const instance = new JsMake();
module.exports = instance;
