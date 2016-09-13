jsmake.task('default', function (argv) {
    jsmake.logger.info('default event');
});

jsmake.task('default').events.on('complete', function () {
    jsmake.logger.info('completed.');
});
