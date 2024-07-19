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

// Watch files
function watchFiles() {
    watch('./src/css/*', css);
    watch('./src/*.html', html);
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

// new functions
function task1(done) {
    console.log('task  1');
    done();
}

function task2(done) {
    console.log('task 2');
    done();
}

function task3(done) {
    console.log('task 3');
    done();
}

// Exporting functions in parallel
exports.runTasks = parallel(task1, task2, task3);

exports.watch = parallel(watchFiles, browserSync);
exports.default = series(clear, parallel(html, css, img));
