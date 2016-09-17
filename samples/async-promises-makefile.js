jsmake.task('default', function (argv) {
    return new Promise(function (resolve, reject) {
        setTimeout(
            function () { console.log('completed.'); resolve(); },
            3000
        );
    });
});
