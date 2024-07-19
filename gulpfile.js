const { src, dest, parallel, series, watch } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const pug = require('gulp-pug');
const cssnano = require('gulp-cssnano');
const changed = require('gulp-changed');
const browsersync = require('browser-sync').create();
const imagemin = require('gulp-imagemin');
const clean = require('gulp-clean');

// clean directory build
function clear() {
    return src('./build/*', { read: false }).pipe(clean());
}

// Компіляція SASS
function styles() {
    return src('./src/scss/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(cssnano())
        .pipe(dest('./build/css'))
        .pipe(browsersync.stream());
}

// Компіляція Pug
function templates() {
    return src('./src/pug/*.pug')
        .pipe(pug())
        .pipe(dest('./build'))
        .pipe(browsersync.stream());
}

// Optimize images
function img() {
    return src('./src/images/*')
        .pipe(imagemin())
        .pipe(dest('./build/images'));
}

// Watch files and directories
function watchFiles() {
    watch('./src/scss/*.scss', styles);
    watch('./src/pug/*.pug', templates);
    watch('./src/images/*', img);
}

// BrowserSync
function browserSync() {
    browsersync.init({
        server: {
            baseDir: './build'
        },
        port: 3000
    });
}

// Development task
const development = series(
    clear,
    parallel(styles, templates, img),
    parallel(watchFiles, browserSync)
);

// Other exports
exports.clear = clear;
exports.styles = styles;
exports.templates = templates;
exports.images = img;
exports.watch = parallel(watchFiles, browserSync);
exports.default = series(clear, parallel(templates, styles, img));
exports.development = development;
