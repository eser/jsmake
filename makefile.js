jsmake.task('pre-test', function (runContext) {
    console.log('loading...');
});

jsmake.task('test', function (runContext) {
    return new Promise(function (resolve, reject) {
        setTimeout(function () { console.log('loading completed.'); resolve(); }, 3000);
    });
});

jsmake.task('post-test', function (runContext) {
    console.log('done.');
});

jsmake.task('default', [ 'test' ], function (runContext) {
    console.log(runContext.argv);
});
