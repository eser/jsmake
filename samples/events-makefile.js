jsmake.task('default', function (argv) {
    console.log('default task');
});

jsmake.tasks.default.events.on('error', function (err) {
    console.error('execution of default task is failed.');
    console.error(err);
});

jsmake.tasks.default.events.on('done', function () {
    console.log('execution of default task is successfully completed.');
});

jsmake.tasks.default.events.on('complete', function () {
    console.log('this event is being executed anyway after execution of default task.');
});
