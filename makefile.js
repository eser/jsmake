jsmake.task('pre-eser', function (context) {
    return new Promise(function (resolve, reject) {
        console.log('loading...');

        setTimeout(function () { console.log('loading completed.'); resolve(); }, 3000);
    });
});

jsmake.task('eser', [ 'pre-eser' ], function (context) {
    console.log(context.argv);
});
