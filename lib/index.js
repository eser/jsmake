"use strict";
const JsMake_1 = require("./JsMake");
const jsmake = new JsMake_1.JsMake();
jsmake.desc('Lists defined tasks');
jsmake.task('tasks', (argv, stream) => {
    for (const task of jsmake.getTaskTree()) {
        stream.write(task);
    }
});
jsmake.desc('Adds a plugin');
jsmake.task('plugins add', async (argv, stream) => {
    const pluginName = argv._[0];
    if (await jsmake.plugins.install(pluginName)) {
        stream.write(`plugin successfully added - ${pluginName}`);
    }
});
jsmake.desc('Removes a plugin');
jsmake.task('plugins remove', async (argv, stream) => {
    const pluginName = argv._[0];
    if (await jsmake.plugins.uninstall(pluginName)) {
        stream.write(`plugin successfully removed - ${pluginName}`);
    }
});
jsmake.desc('Test command');
jsmake.task('test', async (argv, stream) => {
    const pluginName = argv._[0];
    stream.write(`test - ${pluginName}`);
});
jsmake.desc('Test command #1');
jsmake.task('tests first', async (argv, stream) => {
    const pluginName = argv._[0];
    stream.write(`test #1 - ${pluginName}`);
});
console.log(JSON.stringify(jsmake.tasks, null, 2));
module.exports = jsmake;
//# sourceMappingURL=index.js.map