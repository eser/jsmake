jsmake.desc('Bumps the package version for next release.');
jsmake.task('bump', function (argv) {
    var version = jsmake.utils.packageJsonVersionBump('./package.json', 'patch');

    console.log('Bumped to version ' + version + '.');
});

jsmake.desc('Publishes package to npm.');
jsmake.task('publish', function (argv) {
    jsmake.utils.npmPublish();
});

jsmake.desc('Reinstalls dependencies from npm.');
jsmake.task('deps', function (argv) {
    jsmake.utils.rmdir('node_modules');
    jsmake.utils.shell('npm install');
});

jsmake.desc('Builds the source code.');
jsmake.task('build', function (argv) {
    jsmake.utils.shell('sey rebuild');
});
