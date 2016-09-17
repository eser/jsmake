jsmake.desc('Says hi to someone.');
jsmake.task('hello', function (argv) {
    console.log('hi ' + argv.name);
});

jsmake.tasks.hello.parameters.setRule('name', { type: String, description: 'your name' });
