jsmake.task('task1', function (argv) {
    this.logger.info('task1');
});

jsmake.task('task2', function (argv) {
    this.logger.info('task2');
});

jsmake.task('default', [ 'task1', 'task2' ], function (argv) {
    this.logger.info('done.');
});
