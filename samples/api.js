var jsmake = require('../lib/');

jsmake.task('sayHello', function (argv) {
    console.log('hello ' + argv.name);
});

jsmake.exec('sayHello --name=eser');
