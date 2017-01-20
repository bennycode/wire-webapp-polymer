var assets = require('gulp-bower-assets');
var browserSync = require('browser-sync').create();
var bower = require('gulp-bower');
var gulp = require('gulp');
var sass = require('gulp-sass');

var config = {
  dir: {
    app: 'app'
  }

};

gulp.task('build', ['sass'], function() {
});

gulp.task('default', ['build'], function() {
  gulp.watch('app/**/*.html').on('change', browserSync.reload);
  gulp.watch(`${config.dir.app}/sass/**/*.scss`, ['sass']);

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

gulp.task('sass', function() {
  return gulp.src(`${config.dir.app}/sass/**/*.scss`)
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(`${config.dir.app}/css`));
});
