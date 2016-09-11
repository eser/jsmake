jsmake.task('pre-default', function (context) {
    return new Promise(function (resolve, reject) {
        console.log('loading...');

        setTimeout(function () { console.log('loading completed.'); resolve(); }, 3000);
    });
});

jsmake.task('default', [ 'pre-default' ], function (context) {
    console.log(context.argv);
});
