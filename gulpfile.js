'use strict';

var
    gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    htmlmin = require('gulp-htmlmin'),
    concat = require('gulp-concat'),
    declare = require('gulp-declare'),
    wrap = require('gulp-wrap'),
    clean = require('gulp-clean'),
    replace = require('gulp-replace'),
    rename = require('gulp-rename'),
    runSequence = require('run-sequence'),
    handlebars = require('gulp-handlebars'),
    fs = require('fs');

gulp.task('lint', function() {
    return gulp.src(['./client_src/js/*.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('js', function() {
    gulp.src([
        './bower_components/handlebars/handlebars.runtime.js',
        './build/tmpl.js',
        './bower_components/jquery/dist/jquery.js',
        './bower_components/underscore/underscore.js',
        './bower_components/backbone/backbone.js',
        './build/helpers.js',
        './client_src/js/*.js'
    ])
        .pipe(concat('all.js'))
        .pipe(gulp.dest('./build'));
});

gulp.task('hlprs', function() {
    var
        hlprs = fs.readFileSync('./src/helpers.js');

    return gulp.src('./src/*.tmpl')
        .pipe(replace(/<HELPERS_SRC>/g, hlprs))
        .pipe(rename({
            extname: ''
        }))
        .pipe(gulp.dest('./build'));
});

gulp.task('css', function() {
    gulp.src('./client_src/css/*.css')
        .pipe(concat('all.css'))
        .pipe(gulp.dest('./build'));
});

gulp.task('html', function() {
    gulp.src('./client_src/*.html')
        .pipe(htmlmin({
            collapseWhitespace: true
        }))
        .pipe(gulp.dest('./build'));
});

gulp.task('tmpl', function() {
    return gulp.src('./client_src/tmpl/*.hbs')
        .pipe(handlebars())
        .pipe(wrap('Handlebars.template(<%= contents %>)'))
        .pipe(declare({
            namespace: 'SendHub.tmpl',
            noRedeclare: true,
        }))
        .pipe(concat('tmpl.js'))
        .pipe(gulp.dest('./build'));
});

gulp.task('clean', function() {

    return gulp.src('./build').pipe(clean());
});

gulp.task('watch', function() {
    gulp.watch([
        './client_src/js/*.js',
        './src/*.js',
        './client_src/css/*.css',
        './client_src/*.html',
        './client_src/tmpl/*.hbs'
    ], ['build']);
});

gulp.task('build', function(cb) {
    runSequence(
        'lint',
        'clean',
        'hlprs',
        'tmpl',
        ['js', 'css', 'html'],
        cb
    );
});

gulp.task('default', ['build']);