jsmake.task('pre-test', function (argv) {
    this.logger.info('loading...');
});

jsmake.task('test', function (argv) {
    return new Promise(function (resolve, reject) {
        setTimeout(function () { console.log('loading completed.'); resolve(); }, 3000);
    });
});

jsmake.task('post-test', function (argv) {
    this.logger.info('done.');
});

jsmake.task('error', function (argv) {
    throw new Error('an error');
});

jsmake.task('shell', function (argv) {
    jsmake.utils.shell('npm ls');
});

jsmake.task('default', [ 'test' ], function (argv) {
    this.logger.info(argv);
});

jsmake.task({
    name: 'obj',
    callback: function (argv) {
        this.logger.info(argv);
    }
});

const taskInstance = jsmake.newTask('obj2');
taskInstance.setCallback(function (argv) { this.logger.info(argv); });
jsmake.task(taskInstance);
