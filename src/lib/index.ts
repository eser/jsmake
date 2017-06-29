import { JsMake } from './JsMake';

const jsmake = new JsMake();

// TODO load plugins, etc.
jsmake.task('tasks', {
    description: 'Lists defined tasks',
    uiHidden: true,
    action: (argv, stream) => {
        for (const task of jsmake.getTaskTree()) {
            stream.write(task);
        }
    }
});

// jsmake.task('menu', {
//     description: 'Displays the task menu',
//     uiHidden: true,
//     action: (argv) => {
//         jsmake.menu();
//     }
// });

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
// console.log(jsmake.taskRules.children.tasks);
// console.log(jsmake.locateNode('plugins add'));
// console.log(jsmake.tasks.plugins.add);
// console.log(JSON.stringify(jsmake.buildConsultantRules(jsmake.tasks, []), null, 2));
// jsmake.exec('tests first hede');
// process.exit(0);

// jsmake.loadPlugins();

// console.log(JSON.stringify(jsmake.tasks, undefined, 4));
// process.exit(0);

export = jsmake;
