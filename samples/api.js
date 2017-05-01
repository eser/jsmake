// TODO check
var jsmake = require('../lib/');

jsmake.task('sayHello', function (argv) {
    console.log('hello ' + argv.name);
});

jsmake.exec({ _: [ 'sayHello' ], name: 'seyma' });
jsmake.tasks.sayHello.execute({ name: 'europe' });
