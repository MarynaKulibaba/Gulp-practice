const { src, dest, parallel, series, watch } = require('gulp');
const cssnano = require('gulp-cssnano');
const changed = require('gulp-changed');
const browsersync = require('browser-sync').create();
const imagemin = require('gulp-imagemin');
const clean = require('gulp-clean');

// clear directory build
function clear() {
    return src('./build/*', { read: false }).pipe(clean());
}

// CSS
function css() {
    const source = './src/css/style.css';
    return src(source)
        .pipe(changed(source))
        .pipe(cssnano())
        .pipe(dest('./build/css/'))
        .pipe(browsersync.stream());
}

// Optimize images
function img() {
    return src('./src/images/*')
        .pipe(imagemin())
        .pipe(dest('./build/images'));
}

// HTML
function html() {
    return src('./src/*.html')
        .pipe(dest('./build/'))
        .pipe(browsersync.stream());
}

// logger
function log(event) {
    console.log(`File ${event} was changed`);
}

// Watch files and directories
function watchFiles() {
    watch('./src/css/*', series(css, (cb) => { log('CSS'); cb(); }));
    watch('./src/*.html', series(html, (cb) => { log('HTML'); cb(); }));
    watch('./src/images/*', series(img, (cb) => { log('Images'); cb(); }));
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


exports.clear = clear;
exports.css = css;
exports.images = img;
exports.html = html;
exports.watch = parallel(watchFiles, browserSync);
exports.default = series(clear, parallel(html, css, img));
