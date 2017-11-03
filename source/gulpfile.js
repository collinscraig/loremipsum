// Release 2.0.0

// global settings
var scss_src = './static/src/scss/**/',
    scss_dist = './static/dist/css/',
    scss_prefix = 'last 5 versions';

var js_src = './static/src/js/',
    js_dist = './static/dist/js/';

var img_src = './static/src/images/**/*',
    img_dist = './static/dist/images/';

var font_name = 'icon-font',
    font_class_name = 'icon',
    font_src = '/static/src/fonts/',
    font_dist = '/static/dist/fonts/',
    icon_src = './static/src/icons/',
    icon_sprite_dist = './static/dist/icons/',
    icon_sprite_sheet = '../html/*.html';

// dependencies
var browserify = require('browserify'),
    gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefix = require('gulp-autoprefixer'),
    jshint = require('gulp-jshint'),
    stylish = require('jshint-stylish'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    cache = require('gulp-cached'),
    buffer = require('vinyl-buffer'),
    path = require('path'),
    source = require('vinyl-source-stream'),
    errorHandler = require('./errorHandler'),
    postcss = require('gulp-postcss'),
    reporter = require('postcss-reporter'),
    stylelint = require('stylelint'),
    iconfont = require('gulp-iconfont'),
    consolidate = require('gulp-consolidate'),
    syntax_scss = require('postcss-scss'),
    rename = require("gulp-rename"),
    del = require("del"),
    gutil = require('gulp-util');

// main app.js which calls all the js modules
var filename = 'app.js';

// browserify config
var bundler = browserify({
    entries: [path.join(js_src, filename)],
    cache: {},
    packageCache: {},
    fullPaths: true
});

// clean
// @requires gulp-sass
gulp.task('clean', function(cb) {
	return del('./static/dist/', cb);
});

// output CSS files which are expanded
// @requires gulp-sass
// @requires gulp-autoprefixer
// @requires task: scss_lint
gulp.task('scss', function () {
    gulp.src(scss_src + '*.scss')
        .pipe(sass.sync({
            outputStyle: 'expanded'
        }).on('error', sass.logError))
        .pipe(autoprefix({
            browsers: [scss_prefix]
        }))
        .pipe(gulp.dest(scss_dist));
});

// SVG font creation
// @requires gulp-iconfont
// @requires gulp-consolidate
// @requires gulp-rename
gulp.task('icon_font', function () {
    gulp.src([icon_src + '*.svg'])
        .pipe(iconfont({
            fontName: font_name,
            prependUnicode: false,
            normalize: true,
            formats: ['ttf', 'eot', 'woff', 'woff2'],
            fontHeight: 1000
        }))
        .on('glyphs', function (glyphs) {
            gulp.src("." + font_src + '/font_template.css')
                .pipe(consolidate('lodash', {
                    glyphs: glyphs,
                    fontName: font_name,
                    fontPath: font_dist,
                    className: font_class_name
                }))
                .pipe(rename('_icons.scss'))
                .pipe(gulp.dest('./static/src/scss/base/'));
        })
        .pipe(gulp.dest("." + font_dist));
});

// custom scss lint reporter
// @requires beepbeep
// @requires gulp-util
// @requires task: scss_lint
var customReporter = function (file) {
    'use strict';

    if (!file.scsslint.success) {
        if (file.scsslint.errors > 0) {
            gutil.log(gutil.colors.red(file.scsslint.errors + ' errors in ' + ' ' + file.path));
            file.scsslint.issues.forEach(function (val) {
                gutil.log(gutil.colors.blue(val.line + ':' + val.column) + ' - ' + val.reason);
            });
            beepbeep(2);
        }
        if (file.scsslint.warnings > 0) {
            gutil.log(gutil.colors.yellow(file.scsslint.warnings + ' warnings in ' + file.path));
            file.scsslint.issues.forEach(function (val) {
                gutil.log(gutil.colors.blue(val.line + ':' + val.column) + ' - ' + val.reason);
            });
        }
    }
};

// lint js files for errors
// @requires gulp-cached
// @requires gulp-jshint
// @requires jshint-stylish
// @requires .jshintrc config file
gulp.task('js_lint', function () {

    return gulp.src([
            path.join('gulpfile.js', '**', '*.js'),
            path.join(js_src, '**', '*.js'),
        ])
        .pipe(cache('jslint'))
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('jshint-stylish'));
});

// minify images
// @requires gulp-imagemin
// @requires imagemin-pngquant
gulp.task('imagemin', function () {

    return gulp.src(img_src + '*')
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{
                removeViewBox: false
            }]
        }))
        .pipe(gulp.dest(img_dist));
});

// what Browserify should do when building the bundle
function bundle() {
    
    return bundler.bundle()
        // log errors if they happen
        .on('error', errorHandler)
        .pipe(source(filename))
        .pipe(buffer())
        .pipe(gulp.dest(js_dist))
}

// bundle js modules into one file
// @requires browserify
// @requires vinyl-buffer
// @requires vinyl-source-stream
gulp.task('js', bundle);

// gulp tasks
gulp.task('watch', function () {
    gulp.watch(scss_src + '*.scss', ['scss']);
    gulp.watch(js_src + '**/*.js', ['js', 'js_lint']);
});

// gulp
gulp.task('default', ['scss', 'js', 'js_lint', 'icon_font', 'imagemin', 'watch']);