jsmake.task('pre-test', function (argv) {
    console.log('loading...');
});

jsmake.task('test', function (argv) {
    return new Promise(function (resolve, reject) {
        setTimeout(function () { console.log('loading completed.'); resolve(); }, 3000);
    });
});

jsmake.task('post-test', function (argv) {
    console.log('done.');
});

jsmake.task('error', [], function (argv) {
    throw new Error('an error');
});

jsmake.task('shell', [], function (argv) {
    jsmake.utils.shell('npm ls');
});

jsmake.task('default', [ 'test' ], function (argv) {
    console.log(argv);
});
