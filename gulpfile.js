const { src, dest, parallel, series, watch } = require('gulp');
const cssnano = require('gulp-cssnano');
const changed = require('gulp-changed');
const browsersync = require('browser-sync').create();
const imagemin = require('gulp-imagemin');
const clean = require('gulp-clean');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');

// Очищення директорії build
function clear() {
    return src('build/*', { read: false }).pipe(clean());
}

// CSS
function css() {
    return src('src/css/*.css')
        .pipe(changed('build/css'))
        .pipe(cssnano())
        .pipe(dest('build/css'))
        .pipe(browsersync.stream());
}

// JavaScript
function scripts() {
    return src('src/scripts/*.js')
        .pipe(changed('build/js'))
        .pipe(uglify())
        .pipe(rename({ suffix: '.min' }))
        .pipe(dest('build/js'));
}

// Оптимізація images
function images() {
    return src('src/images/*')
        .pipe(imagemin())
        .pipe(dest('build/images'));
}

// copy HTML
function html() {
    return src('src/*.html')
        .pipe(dest('build'))
        .pipe(browsersync.stream());
}

// copy fonts
function fonts() {
    return src('src/fonts/*')
        .pipe(dest('build/fonts'));
}

// copy JS файлів з src/scripts до build/js і src/scripts/deleted
function copyScripts() {
    return src('src/scripts/*.js')
        .pipe(dest('build/js'))
        .pipe(dest('src/scripts/deleted'));
}

// Track changes in files
function watchFiles() {
    watch('src/css/*.css', css);
    watch('src/scripts/*.js', scripts);
    watch('src/images/*', images);
    watch('src/fonts/*', fonts);
    watch('src/*.html', html);
}

// setting BrowserSync
function browserSync() {
    browsersync.init({
        server: {
            baseDir: './build'
        },
        port: 3000
    });
}

exports.clear = clear;
exports.css = css;
exports.images = images;
exports.scripts = scripts;
exports.html = html;
exports.fonts = fonts;
exports.copyScripts = copyScripts;
exports.watch = parallel(watchFiles, browserSync);
exports.default = series(clear, parallel(html, css, images, fonts, scripts, copyScripts));
