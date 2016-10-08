var gulp = require('gulp'),
  ngAnnotate = require('gulp-ng-annotate'),
  sass = require('gulp-sass'),
  autoprefixer = require('gulp-autoprefixer'),
  jshint = require('gulp-jshint'),
  uglify = require('gulp-uglify'),
  rename = require('gulp-rename'),
  concat = require('gulp-concat'),
  notify = require('gulp-notify'),
  livereload = require('gulp-livereload');
var browserSync = require('browser-sync').create();
gulp.task('browser-sync', function() {
  var files = [
    '**/*.html',
    '**/*.css',
    '**/*.js'
  ];
  browserSync.init(files, {
    server: {
      baseDir: "./"
    }
  });
});

gulp.task('scripts', function() {
  gulp.src('./script/*.js')
    .pipe(ngAnnotate())
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(concat('ng.js'))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'))
    .pipe(notify({
      message: 'Scripts task complete!'
    }));

  gulp.src('./static/js/angular*.min.js')
    .pipe(ngAnnotate())
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(concat('core.js'))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'))
    .pipe(notify({
      message: 'Scripts task complete!'
    }));
});
gulp.task('default', ['browser-sync']); //定义默认任务
