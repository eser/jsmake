"use strict";
const JsMake_1 = require("./JsMake");
const jsmake = new JsMake_1.JsMake();
jsmake.task('tasks', {
    description: 'Lists defined tasks',
    uiHidden: true,
    action: (argv, stream) => {
        for (const task of jsmake.getTaskTree()) {
            stream.write(task);
        }
    }
});
jsmake.task('plugins add', {
    description: 'Adds a plugin',
    uiHidden: true,
    action: async (argv, stream) => {
        const pluginName = argv._[0];
        if (await jsmake.plugins.install(pluginName)) {
            stream.write(`plugin successfully added - ${pluginName}`);
        }
    }
});
jsmake.task('plugins remove', {
    description: 'Removes a plugin',
    uiHidden: true,
    action: async (argv, stream) => {
        const pluginName = argv._[0];
        if (await jsmake.plugins.uninstall(pluginName)) {
            stream.write(`plugin successfully removed - ${pluginName}`);
        }
    }
});
jsmake.task('test', {
    description: 'Test command',
    uiHidden: false,
    action: async (argv, stream) => {
        const pluginName = argv._[0];
        stream.write(`test - ${pluginName}`);
    }
});
jsmake.task('tests first', {
    description: 'Test command #1',
    uiHidden: true,
    action: async (argv, stream) => {
        const pluginName = argv._[0];
        stream.write(`test #1 - ${pluginName}`);
    }
});
const util = require('util');
console.log(util.inspect(jsmake.taskRules, { showHidden: false, depth: null }));
module.exports = jsmake;
//# sourceMappingURL=index.js.map