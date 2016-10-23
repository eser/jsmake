import { JsMake } from './JsMake.js';

const jsmake = new JsMake();

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
jsmake.task('plugins add', function (argv) {
    const pluginName = argv._[0];

    jsmake.plugins.install(pluginName);
});
jsmake.tasks['plugins add'].menuHidden = true;

jsmake.desc('Removes a plugin');
jsmake.task('plugins remove', function (argv) {
    const pluginName = argv._[0];

    jsmake.plugins.uninstall(pluginName);
});
jsmake.tasks['plugins remove'].menuHidden = true;

module.exports = jsmake;
