var gulp = require('gulp');
var gutil = require('gulp-util');
var tsc = require('gulp-typescript');
var jetpack = require('fs-jetpack');
var merge = require('merge2');

var jsDir = jetpack.cwd('js');
var tsDir = jetpack.cwd('ts');
var dtsDir = jetpack.cwd('typings/win-processes');

gulp.task('clean', function () {

    return jsDir.dir('.', { empty: true });
})

gulp.task('compile-ts', ['clean'], function () {
    var tsProject = tsc.createProject('tsconfig.json');
    var result = gulp.src(tsDir.path('**/*.ts'))
        .pipe(tsc(tsProject));

    return merge(
        result.js.pipe(gulp.dest(jsDir.path())),
        result.dts.pipe(gulp.dest(dtsDir.path()))
        );

});

gulp.task('build', ['clean', 'compile-ts']);
