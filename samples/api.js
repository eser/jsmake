var jsmake = require('../lib/');

jsmake.task('sayHello', function (argv) {
    console.log('hello ' + argv.name);
});

jsmake.execString('sayHello --name=eser');
jsmake.exec({ _: [ 'sayHello' ], name: 'seyma' });
jsmake.tasks.sayHello.execute({ name: 'europe' });
