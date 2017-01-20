var assets = require('gulp-bower-assets');
var bower = require('gulp-bower');
var browserSync = require('browser-sync').create();
var insert = require('gulp-insert');
var gulp = require('gulp');
var rename = require('gulp-rename');
var runSequence = require('run-sequence');
var sass = require('gulp-sass');

var config = {
  dir: {
    app: 'app',
    styles_src: 'app/sass',
    styles_dist: 'app/css'
  }
};

gulp.task('build', function(done) {
  runSequence(['styles_build'], ['styles_copy'], ['styles_insert'], done);
});

gulp.task('default', ['build'], function() {
  gulp.watch('app/**/*.html').on('change', browserSync.reload);
  gulp.watch(`${config.dir.app}/sass/**/*.scss`, ['styles_build']);

  browserSync.init({
    port: 3636,
    server: {baseDir: './'},
    startPath: `/index.html`
  });
});

gulp.task('install', ['install_bower_assets'], function() {
});

gulp.task('install_bower', function() {
  return bower({cmd: 'install'});
});

gulp.task('install_bower_assets', ['install_bower'], function() {
  return gulp.src('bower_assets.json')
    .pipe(assets({
      prefix: function(name, prefix) {
        return prefix + '/' + name;
      }
    }))
    .pipe(gulp.dest(`${config.dir.app}/lib`));
});

gulp.task('styles_build', function() {
  var path;

  path = '/';
  gulp.src(`${config.dir.styles_src}${path}*.scss`)
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(`${config.dir.styles_dist}${path}`));

  path = '/skins/default/';
  return gulp.src(`${config.dir.styles_src}${path}*.scss`)
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(`${config.dir.styles_dist}${path}`));
});

gulp.task('styles_insert', function() {
  return gulp.src(`${config.dir.styles_dist}/skins/default/color-vars.css`)
    .pipe(insert.append('</style>'))
    .pipe(insert.prepend(`<style is="custom-style">`))
    .pipe(gulp.dest(`${config.dir.styles_dist}/skins/default`));
});

gulp.task('styles_copy', function() {
  return gulp.src(`${config.dir.styles_dist}/skins/default/color-vars-body.css`)
    .pipe(rename('color-vars.css'))
    .pipe(gulp.dest(`${config.dir.styles_dist}/skins/default`));
});
