var fs = require('file-system');
var gulp = require('gulp');
var sass = require('gulp-sass');
var twig = require('gulp-twig');
var copy = require('gulp-copy');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var cleanCSS = require('gulp-clean-css');
var browserSync = require('browser-sync').create();

gulp.task('css', function() {
	return gulp
	    .src('./node_modules/normalize.css/normalize.css')
	    .pipe(rename('normalize.scss'))
	    .pipe(gulp.dest('./scss'));
});

gulp.task('sass', function () {
	return gulp.src('scss/app.scss')
		.pipe(sass())
		.pipe(cleanCSS({compatibility: 'ie8'}))
		.pipe(gulp.dest('docs/css'))
		.pipe(browserSync.reload({
			stream: true
		}));
});

gulp.task('js', function () {
	return gulp.src(['./node_modules/js-cookie/src/js.cookie.js', 'js/app.js'])
		.pipe(concat('app.js'))
		.pipe(gulp.dest('./docs/js/'))
		.pipe(browserSync.reload({
			stream: true
		}));
});

gulp.task('twig', function () {
    'use strict';
    return gulp.src('./twig/index.twig')
        .pipe(twig({
            data: JSON.parse(fs.readFileSync('gameData.json'))
        }))
        .pipe(gulp.dest('./docs'))
		.pipe(browserSync.reload({
			stream: true
		}));
});

gulp.task('images', function () {
	return gulp
		.src('./img/*')
		.pipe(copy('./docs'))
		.pipe(browserSync.reload({
			stream: true
		}));
});

gulp.task('fonts', function () {
	return gulp
		.src('./fonts/*')
		.pipe(copy('./docs'))
		.pipe(browserSync.reload({
			stream: true
		}));
});

gulp.task('watch', function() {
	gulp.watch('scss/*', gulp.series(['sass']));
	gulp.watch('js/*', gulp.series(['js']));
	gulp.watch(['twig/*', 'gameData.json'], gulp.series(['twig']));
	gulp.watch('img/*', gulp.series(['images']));
	gulp.watch('fonts/*', gulp.series(['fonts']));
	browserSync.init({
		server: {
			baseDir: 'docs'
		},
	});
});

gulp.task('default', gulp.series(['css', 'images', 'fonts', 'sass', 'js', 'twig', 'watch']));