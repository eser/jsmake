import { JsMake } from './JsMake';

const jsmake = new JsMake();

// TODO load plugins, etc.
jsmake.desc('Lists defined tasks');
jsmake.task('tasks', (argv, stream) => {
    for (const task of jsmake.getTaskTree()) {
        stream.write(task);
    }
});
// jsmake.tasks.tasks.menuHidden = true;

// jsmake.desc('Displays the task menu');
// jsmake.task('menu', (argv) => {
//     jsmake.menu();
// });
// jsmake.tasks.menu.menuHidden = true;

jsmake.desc('Adds a plugin');
jsmake.task('plugins add', async (argv, stream) => {
    const pluginName = argv._[0];

    if (await jsmake.plugins.install(pluginName)) {
        stream.write(`plugin successfully added - ${pluginName}`);
    }
});
// jsmake.tasks.plugins.add.menuHidden = true;

jsmake.desc('Removes a plugin');
jsmake.task('plugins remove', async (argv, stream) => {
    const pluginName = argv._[0];

    if (await jsmake.plugins.uninstall(pluginName)) {
        stream.write(`plugin successfully removed - ${pluginName}`);
    }
});
// jsmake.tasks.plugins.remove.menuHidden = true;

jsmake.desc('Test command');
jsmake.task('test', async (argv, stream) => {
    const pluginName = argv._[0];

    stream.write(`test - ${pluginName}`);
});
// jsmake.tasks.test.menuHidden = true;

jsmake.desc('Test command #1');
jsmake.task('tests first', async (argv, stream) => {
    const pluginName = argv._[0];

    stream.write(`test #1 - ${pluginName}`);
});
// jsmake.tasks.test.menuHidden = true;

console.log(JSON.stringify(jsmake.tasks, null, 2));
// console.log(jsmake.locatePath('plugins add'));
// console.log(jsmake.tasks.plugins.add);
// console.log(JSON.stringify(jsmake.buildConsultantRules(jsmake.tasks, []), null, 2));
// jsmake.exec('tests first hede');
// process.exit(0);

// jsmake.loadPlugins();

// console.log(JSON.stringify(jsmake.tasks, undefined, 4));
// process.exit(0);

export = jsmake;
