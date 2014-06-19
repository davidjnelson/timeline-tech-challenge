var gulp = require('gulp'),
    mocha = require('gulp-mocha'),
    selenium = require('selenium-standalone'),
    connect = require('gulp-connect'),
    server;

global.functionalTestType = 'local';

gulp.task('start-web-server', function(callback) {
    connect.server({
        root: [__dirname],
        port: 8000,
        livereload: false
    });

    callback();
});

gulp.task('start-selenium', function(callback) {
    server = selenium();
    server.stdout.on('data', function(output) {
        console.log(output);
    });
    callback();
});

gulp.task('execute-functional-tests', function() {
    return gulp.src('tests/functional/specs/**/*.js')
        .pipe(mocha({
            reporter: 'spec',
            timeout: 60000
        })
    );
});

gulp.task('functional-test-local', function() {
    // TODO: find a way to pass data to gulp tasks that doesn't require globals
    global.functionalTestType = 'local';

    return gulp.src('tests/functional/specs/**/*.js')
        .pipe(mocha({
            reporter: 'spec',
            timeout: 60000
        })
    );

    // TODO: fix functional test watch - was working before...
    //gulp.watch(['tests/functional/specs/**/*.js'], ['execute-functional-tests']);
});

gulp.task('functional-test-all-browsers', function() {
    global.functionalTestType = 'all-browsers';

    return gulp.src('tests/functional/specs/**/*.js')
        .pipe(mocha({
            reporter: 'spec',
            timeout: 60000
        })
    );
});