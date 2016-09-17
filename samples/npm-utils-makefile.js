jsmake.task('bump', function (argv) {
    var version = jsmake.utils.packageJsonVersionBump('./package.json', 'patch');

    console.log('Bumped to version ' + version + ', now publishing...');

    jsmake.utils.npmPublish();
});
