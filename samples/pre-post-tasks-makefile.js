jsmake.task('pre-default', function (argv) {
    this.logger.info('pre-event');
});

jsmake.task('default', function (argv) {
    this.logger.info('default event');
});

jsmake.task('post-default', function (argv) {
    this.logger.info('post-event');
});
