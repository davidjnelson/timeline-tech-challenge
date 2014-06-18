var gulp = require('gulp'),
    mocha = require('gulp-mocha'),
    selenium = require('selenium-standalone'),
    runSequence = require('run-sequence'),
    runFunctionalTests = function() {
        return gulp.src('tests/functional/specs/**/*.js')
            .pipe(mocha({
                reporter: 'spec',
                timeout: 60000
            })
        );
    },
    server;

global.functionalTestType = 'local';

gulp.task('start-selenium', function(callback) {
    server = selenium();
    server.stdout.on('data', function(output) {
        console.log(output);
    });
    callback();
});

gulp.task('functional-test-local', function() {
    global.functionalTestType = 'local';
    runFunctionalTests();
});

gulp.task('functional-test-all-browsers', function() {
    global.functionalTestType = 'all-browsers';
    runFunctionalTests();
});
