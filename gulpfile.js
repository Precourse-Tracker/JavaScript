var gulp = require('gulp'),
    // stylus = require('gulp-stylus'),
    styles = require('gulp-sass'),
    concat = require('gulp-concat'),
    // uglify = require('gulp-uglify'),
    uglifycss = require('gulp-uglifycss'),
    ngAnnotate = require('gulp-ng-annotate'),
    watcher = gulp.watch(['./main/**/*.js', './main/styles/*.scss', './main/**/*.html'], ['default']);

watcher.on('change', function(event) {
    console.log('File ' + event.path + ' was ' + event.type + ' at ' + new Date() + ' , running tasks...');
});

gulp.task('styles', function() { // .scss is newer file version of .sass
    gulp.src('./main/styles/*.scss')
        // .pipe(stylus())
        .pipe(sass())
        .pipe(uglifycss())
        .pipe(concat('styles.css'))
        .pipe(gulp.dest('./public/styles'))
});

gulp.task('javascript', function() {
    gulp.src('./main/**/*.js')
        .pipe(ngAnnotate())
        // .pipe(uglify())
        .pipe(concat('all.js'))
        .pipe(gulp.dest('./public/scripts'))
});

gulp.task('html', function() {
    gulp.src('./main/**/*.html')
        // .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest('./public/html/'))
});

gulp.task('default', ['styles', 'javascript', 'html']);