jsmake.task('pre-eser', function (argv) {
    console.log('pre-eser');
});

jsmake.task('eser', [ 'pre-eser' ], function (argv) {
    console.log(argv);
});
