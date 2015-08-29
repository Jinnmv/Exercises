'use strict';

var gulp = require('gulp'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    autoprefixer = require('gulp-autoprefixer'),
    sourcemaps = require('gulp-sourcemaps'),
    minifyCss = require('gulp-minify-css'),
    rename = require('gulp-rename'),
    imagemin = require('gulp-imagemin'),
    livereload = require('gulp-livereload');

var SRC = './_src/';
var DIST = './_dist/';

gulp.task('sass', function(){
	gulp.src(SRC + 'sass/**/*.scss')
		.pipe(sourcemaps.init())
		.pipe(sass().on('error', sass.logError))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(SRC + 'css'))
		.pipe(livereload());
});

gulp.task('css', ['copy:css','css:autoprefix']);

gulp.task('css:autoprefix', function(){
	gulp.src(SRC + 'css/**/*.css')
		.pipe(autoprefixer())
		.pipe(livereload());
});

gulp.task('copy:css', function(){
	gulp.src(SRC + 'css/**/*.css')
		.pipe(gulp.dest(DIST + 'css'))
		.pipe(minifyCss())
		.pipe(rename({ extname: '.min.css' }))
		.pipe(gulp.dest(DIST + 'css'))	
});

gulp.task('img', ['img:min']);
 
gulp.task('img:min', function(){
	gulp.src(SRC + 'img/*')
		.pipe(imagemin({
			progressive: true,
            svgoPlugins: [{removeViewBox: false}]
		}))
		.pipe(gulp.dest(DIST + 'img'))
		.pipe(livereload());
});

gulp.task('html', ['copy:html']);

gulp.task('copy:html', function(){
	var stream = gulp.src(SRC + '*.html')
		.pipe(gulp.dest(DIST))
		.pipe(livereload());
	return stream;
});

gulp.task('copy:normalize', function(){
	var stream = gulp.src('./node_modules/normalize.css/normalize.css')
		.pipe(gulp.dest(DIST + 'css'))
		.pipe(gulp.dest(SRC + 'css'))
		.pipe(minifyCss())
		.pipe(rename({ extname: '.min.css' }))
		.pipe(gulp.dest(DIST + 'css'));
	return stream;
});

gulp.task('copy', [
	'copy:html',
	'copy:normalize'
]);

gulp.task('watch', function(){
	livereload.listen({basePath: SRC});
	gulp.watch(SRC + 'sass/**/*.scss', ['sass']);
	gulp.watch(SRC + 'css/**/*.css', ['css']);
	gulp.watch(SRC + 'img/*', ['img']);
	gulp.watch(SRC + '*.html', ['html']);
})

gulp.task('default', ['watch', 'img', 'sass', 'css', 'copy' ]);