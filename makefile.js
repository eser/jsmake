jsmake.task('pre-eser', function (context) {
    console.log('pre-eser');
});

jsmake.task('eser', [ 'pre-eser' ], function (context) {
    console.log(context.argv);
});
