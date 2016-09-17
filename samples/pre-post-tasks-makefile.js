jsmake.task('pre-default', function (argv) {
    console.log('pre-default task, runs before default task.');
});

jsmake.task('default', function (argv) {
    console.log('default task');
});

jsmake.task('post-default', function (argv) {
    console.log('post-default task, runs after default task.');
});
