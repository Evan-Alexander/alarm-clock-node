var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var utilities = require('gulp-util');
var uglify = require('gulp-uglify');
var del = require('del');
var buildProduction = utilities.env.production;

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
