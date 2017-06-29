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
    description: 'Test command #1',
    uiHidden: false,
    action: async (argv, stream) => {
        // TODO why we can't access the parameter w/ argv.info
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

// console.log(jsmake.taskRules.children.tasks);
// console.log(jsmake.locateNode('plugins add'));
// console.log(jsmake.tasks.plugins.add);
// console.log(JSON.stringify(jsmake.buildConsultantRules(jsmake.tasks, []), null, 2));

// jsmake.loadPlugins();

// console.dir(jsmake.taskRules, { showHidden: false, depth: null, colors: true });
// process.exit(0);

jsmake.exec('test --info=hede');

export = jsmake;
