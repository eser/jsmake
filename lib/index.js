/**
 * jsmake
 *
 * @version v0.0.1
 * @link http://eser.ozvataf.com
 */
'use strict';

var _JsMake = require('./JsMake.js');

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

const jsmake = new _JsMake.JsMake();

if (global.jsmake === undefined) {
    global.jsmake = jsmake;
}

// TODO load plugins, etc.
jsmake.desc('Lists defined tasks');
jsmake.task('tasks', function (argv) {
    for (const task of jsmake.getTaskNames()) {
        console.log(task);
    }
});
jsmake.tasks.tasks.menuHidden = true;

jsmake.desc('Displays the task menu');
jsmake.task('menu', function (argv) {
    jsmake.menu();
});
jsmake.tasks.menu.menuHidden = true;

jsmake.desc('Adds a plugin');
jsmake.task('plugins add', (() => {
    var ref = _asyncToGenerator(function* (argv) {
        const pluginName = argv._[0];

        if (yield jsmake.plugins.install(pluginName)) {
            console.log(`plugin successfully added - ${ pluginName }`);
        }
    });

    return function (_x) {
        return ref.apply(this, arguments);
    };
})());
jsmake.tasks['plugins add'].menuHidden = true;

jsmake.desc('Removes a plugin');
jsmake.task('plugins remove', (() => {
    var ref = _asyncToGenerator(function* (argv) {
        const pluginName = argv._[0];

        if (yield jsmake.plugins.uninstall(pluginName)) {
            console.log(`plugin successfully removed - ${ pluginName }`);
        }
    });

    return function (_x2) {
        return ref.apply(this, arguments);
    };
})());
jsmake.tasks['plugins remove'].menuHidden = true;

module.exports = jsmake;