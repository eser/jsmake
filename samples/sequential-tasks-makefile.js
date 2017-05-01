// TODO check
jsmake.task('task1', function (argv) {
    console.log('task1');
});

jsmake.task('task2', function (argv) {
    console.log('task2');
});

jsmake.task('default', [ 'task1', 'task2' ], function (argv) {
    console.log('done.');
});
