var gulp = require('gulp');
var clean = require('gulp-clean');
var uglify = require('gulp-uglify');
var browserify = require('browserify');
var browatchify = require('gulp-browatchify');
var reactify = require('reactify');
var source = require('vinyl-source-stream');
var browserSync = require('browser-sync');
var streamify = require('gulp-streamify');
var sass = require('gulp-ruby-sass');
var sourcemaps = require('gulp-sourcemaps');
var bower = require('gulp-bower');
var revall = require('gulp-rev-all');
var concat = require('gulp-concat');
var order = require("gulp-order");
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var runSequence = require('run-sequence');

// Run browserify and use reactify transformer
gulp.task('browserify', function() {
    gulp.src('./app/scripts/react/router.jsx')
        .pipe(browatchify({
            debug: true,
            transforms: [reactify]
        }))
        .pipe(source('bundle.js'))
        .pipe(gulp.dest('./dist/scripts/'));
});

// Our JS task. It will Browserify our code and compile React JSX files.
gulp.task('browserify-compress', function() {
    browserify('./app/scripts/react/router.jsx')
        .transform(reactify)
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(streamify(uglify()))
        .pipe(gulp.dest('./dist/scripts/'));
});

// Delete the dist directory
gulp.task('clean', function() {
    return gulp.src(['./dist', './build'])
        .pipe(clean({
            force: true
        }));
});

// Copy all other files to dist directly
gulp.task('copy', function() {
    gulp.src('./app/*.html')
        .pipe(gulp.dest('./dist'));
    gulp.src('./bower_components/bootstrap-sass/assets/fonts/bootstrap/*')
        .pipe(gulp.dest('./dist/fonts/bootstrap'));
    gulp.src('./bower_components/font-awesome/fonts/*')
        .pipe(gulp.dest('./dist/fonts'));
    gulp.src('./bower_components/bootstrap-sass/assets/javascripts/bootstrap.js')
        .pipe(gulp.dest('./app/scripts/lib/bootstrap/'));
    gulp.src('./bower_components/jquery/dist/jquery.js')
        .pipe(gulp.dest('./app/scripts/lib/jquery/'));
});

// Generate css file
gulp.task('sass', function() {
    return sass('./app/styles/main.scss', {
            container: 'gulp-ruby-sass-app',
            style: 'compressed'
        })
        .on('error', function(err) {
            console.error('Error', err.message);
        })
        .pipe(gulp.dest('./dist/css'));
});

// Generate css file and sourcemaps
gulp.task('sass-dev', function() {
    return sass('./app/styles/main.scss', {
            container: 'gulp-ruby-sass-app',
            style: 'nested',
            sourcemap: true
        })
        .on('error', function(err) {
            console.error('Error', err.message);
        })
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./dist/css'));
});

// Install everything in bower.json
gulp.task('bower', function() { 
    return bower() .pipe(gulp.dest('./bower_components')) 
});

// Start server
gulp.task('browser-sync', ['browserify', 'copy'], function() {
    browserSync({
        server: {
            baseDir: './dist'
        }
    });
});

// Create a vendor JS file
gulp.task('vendor', ['copy'], function() {
    return gulp.src('./app/scripts/lib/**/*.js')
        .pipe(order([
            "app/scripts/lib/jquery/*.js",
            "app/scripts/lib/**/*.js"
        ], {
            base: './'
        }))
        .pipe(concat('vendor.js'))
        .pipe(gulp.dest('./dist/scripts/'))
});

// Create a vendor JS file and uglify it
gulp.task('vendor-uglify', ['copy'], function() {
    return gulp.src('./app/scripts/lib/**/*.js')
        .pipe(order([
            "app/scripts/lib/jquery/*.js",
            "app/scripts/lib/**/*.js"
        ], {
            base: './'
        }))
        .pipe(concat('vendor.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./dist/scripts/'))
});

// Revision all files and copy to build dir
gulp.task('revision', ['bower', 'sass', 'copy', 'vendor-uglify'], function() {
    gulp.src('./dist/**')
        .pipe(revall({
            ignore: [/^\/favicon.ico$/g, /^\/index.html/g]
        }))
        .pipe(gulp.dest('./build'));
});

// JSHint own js files
gulp.task('jshint', function() {
    return gulp.src(['./app/scripts/**/*.js', '!./app/scripts/lib/**/*.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(jshint.reporter('fail'));
});

// Build for production
gulp.task('build', function() {
    runSequence('clean', ['jshint', 'browserify-compress', 'bower', 'sass', 'copy', 'vendor-uglify', 'revision']);
});

// Build for testing
gulp.task('default', function() {
    runSequence('clean', ['browserify', 'bower', 'sass-dev', 'copy', 'vendor', 'browser-sync'],
        function() {
            gulp.watch('./app/**/*.jsx', ['browserify']);
            gulp.watch('./app/*.html', ['copy']);
            gulp.watch('./app/styles/*.scss', ['sass']);
            gulp.watch('./bower.json', ['bower']);
            gulp.watch("./dist/css/*.css").on('change', browserSync.reload);
            gulp.watch("./dist/scripts/*.js").on('change', browserSync.reload);
        });
});
