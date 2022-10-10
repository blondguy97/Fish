'use strict';

const gulp         = require('gulp');
const scss         = require('gulp-sass')(require('sass'));
const concat       = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const uglify       = require('gulp-uglify');
const browserSync  = require('browser-sync').create();
const imagemin     = require('gulp-imagemin');
const del          = require('del');



// с помощью слова require мы присваиваем переменной scss всю силу плагина "gulp-sass" который установился в папку node-modules

function styles() {
    return gulp.src('development/scss/style.scss')
        .pipe(scss({
            outputStyle: 'compressed'
        }))
        .pipe(concat('style.min.css'))
        .pipe(autoprefixer({
            overrideBrowserslist:  ['last 10 versions'],
            grid: true
        }))
        .pipe(gulp.dest('development/css'))
        .pipe(browserSync.stream())
}

function browsersync() {
    browserSync.init({
        server: {
            baseDir: "development/"
        },
        notify: false
    });
}


 
function scripts() {
    return gulp.src([
        'node_modules/jquery/dist/jquery.js',
        'development/js/main.js',
    ])
    .pipe(concat('main.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('development/js'))
    .pipe(browserSync.stream())

}


function watching() {
    gulp.watch('development/scss/**/*.scss', styles)
    gulp.watch(['development/js/**/*.js', '!development/js/main.min.js'], scripts)
    gulp.watch('development/**/*.html').on('change', browserSync.reload)
}

function cleanDist() {
    return del('finished-app')
}


function build() {
    return gulp.src([
        'development/**/*.html',
        'development/css/style.min.css',
        'development/js/main.min.js'
    ], {base: 'development'})
    .pipe(gulp.dest('finished-app'))
}

exports.styles = styles;
exports.scripts = scripts;
exports.browsersync = browsersync;
exports.watching = watching;
exports.cleanDist = cleanDist;
exports.build = gulp.series(cleanDist, build);


exports.default = gulp.parallel(styles, scripts, browsersync, watching)