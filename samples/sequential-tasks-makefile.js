jsmake.task('test', function (argv) {
    this.logger.info('test');
});

jsmake.task('default', [ 'test' ], function (argv) {
    this.logger.info(argv);
});
