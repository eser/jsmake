jsmake.task('bump', function (argv) {
    jsmake.utils.packageJsonVersionBump('./package.json', 'patch');
    jsmake.utils.npmPublish();
});
