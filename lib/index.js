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
    description: 'Test command #1',
    uiHidden: false,
    action: async (argv, stream) => {
        console.dir(argv, { depth: null, colors: true });
        stream.write(`test #1 - ${argv.values.test.info}`);
    },
    children: {
        info: {
            type: 'stringParameter',
            label: 'Message',
            description: 'Specifies a custom message',
            'default': 'http://github.com/eserozvataf/',
            uiHidden: true,
            min: 0,
            max: 1
        }
    }
});
jsmake.task('tests first', {
    description: 'Test command #2',
    uiHidden: true,
    action: async (argv, stream) => {
        stream.write(`test #2 - ${argv.info}`);
    },
    children: {
        info: {
            type: 'stringParameter',
            label: 'Message',
            description: 'Specifies a custom message',
            'default': 'http://github.com/eserozvataf/',
            uiHidden: true,
            min: 0,
            max: 1
        }
    }
});
jsmake.exec('test --info=hede');
module.exports = jsmake;
//# sourceMappingURL=index.js.map