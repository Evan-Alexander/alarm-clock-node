var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var utilities = require('gulp-util');
var uglify = require('gulp-uglify');
var del = require('del');
var buildProduction = utilities.env.production;
var jshint = require('gulp-jshint');
var browserSync = require('browser-sync').create();

gulp.task('jshint', function(){
  return gulp.src(['js/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('build', ['clean'], function() {
  if (buildProduction) {
    gulp.start('minifyScripts');
  } else {
    gulp.start('jsBrowserify');
  }
});

gulp.task("clean", function(){
  return del(['build', 'tmp']);
});

gulp.task("minifyScripts", ["jsBrowserify"], function(){
  return gulp.src("./build/js/app.js")
    .pipe(uglify())
    .pipe(gulp.dest("./build/js"));
});

gulp.task('jsBrowserify', function() {
  return browserify({ entries: ['./js/alarm-clock-interface.js'] })
  .bundle()
  .pipe(source('app.js'))
  .pipe(gulp.dest('./build/js'));
});

gulp.task('serve', function() {
  browserSync.init({
    server: {
      baseDir: "./",
      index: "index.html"
    }
  });
   gulp.watch(['js/*.js'], ['jsBuild']);
   gulp.watch(['bower.json'], ['bowerBuild']);
});

gulp.task('bowerBuild', ['bower'], function(){
  browserSync.reload();
});

gulp.task('jsBuild', ['jsBrowserify', 'jshint'], function(){
  browserSync.reload();
});
