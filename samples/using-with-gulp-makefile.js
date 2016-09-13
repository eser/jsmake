const gulp = require('gulp');

jsmake.task('default', function (argv) {
    gulp.src('./src/**/*.js')
        // .pipe(...)
        .pipe(gulp.dest('./dest/'));
});
