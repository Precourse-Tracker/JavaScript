var gulp = require('gulp'),
    // stylus = require('gulp-stylus'),
    styles = require('gulp-sass'),
    concat = require('gulp-concat'),
    // uglify = require('gulp-uglify'),
    uglifycss = require('gulp-uglifycss'),
    stripCode = require('gulp-strip-code'),
    ngAnnotate = require('gulp-ng-annotate'),
    watcher = gulp.watch(['./main/**/*.js', './main/styles/*.scss', './main/**/*.html', './main/jquery.js'], ['default']);

watcher.on('change', function(event) {
  console.log('File ' + event.path + ' was ' + event.type + ' at ' + new Date() + ' , running tasks...');
});
//browser sync to get live server like features with gulp

gulp.task('styles', function() { // .scss is newer file version of .sass
  gulp.src('./main/**/*.scss')
    // .pipe(stylus())
    .pipe(styles())
    // .pipe(uglifycss())
    .pipe(concat('styles.css'))
    .pipe(gulp.dest('./public/styles'))
});

gulp.task('javascript', function() {
  gulp.src(['./main/**/*.js', '!./main/jquery.js'])
    .pipe(ngAnnotate())
    // .pipe(uglify())
    .pipe(concat('all.js'))
    .pipe(gulp.dest('./public/scripts'))
});

gulp.task('jquery', function() {
  gulp.src('./main/jquery.js')
    .pipe(ngAnnotate())
    .pipe(gulp.dest('./public/scripts'))
});

gulp.task('html', function() {
  gulp.src('./main/**/*.html')
    // .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('./public/html/'))
});


gulp.task('default', ['styles', 'javascript', 'html', 'jquery']);
