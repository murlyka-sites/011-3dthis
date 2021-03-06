/*jshint esversion: 6 */

const gulp = require('gulp');
const watch = require('gulp-watch');
const spritesmith = require('gulp.spritesmith');
const livereload = require('gulp-livereload');
const connect = require('gulp-connect');
const pug = require('gulp-pug');
const plumber = require('gulp-plumber');
const less = require('gulp-less');
const imagemin = require('gulp-imagemin');
	
	imagemin.mozjpeg = require('imagemin-mozjpeg');
	imagemin.pngquant = require('imagemin-pngquant');

gulp.task('sprite', taskSprite);
gulp.task('pug', taskPug);
gulp.task('less', taskLess);
gulp.task('connect', taskConnect);
gulp.task('imagemin', taskImagemin);

gulp.task('watch', function() {
	taskConnect();

	watch('./source/sprite/*.png', taskSprite);
	watch('./source/*.pug', taskPug).pipe(connect.reload());
	watch('./source/less/*.less', taskLess).pipe(connect.reload());
	watch('./source/images/*.*', taskImagemin).pipe(connect.reload());
});


/*


gulp.task('style', function() {
	var csslint = require('gulp-csslint'),
		csslintReport = require('gulp-csslint-sourcemap-reporter'),
		plumber = require('gulp-plumber'),
		sourcemaps = require('gulp-sourcemaps');

	return gulp.src('./dev/css/*.css')
		.pipe(plumber())
		
		//.pipe(sourcemaps.init({loadMaps: true}))
		
		//.pipe(sourcemaps.write('.'))
		.pipe(csslint())
		.pipe(csslint.reporter(csslintReport))
		.pipe(reload({stream:true}));


		//.pipe(concat('style.css'))

});

gulp.task('critical', function() {
	var critical = require('critical'),
		criticalOption = require('./dev/critical.json');

	critical.generate(criticalOption);
});

gulp.task('image:build', function() {
	var imagemin = require('gulp-imagemin');

	return gulp.src('./dev/images/*')
		.pipe(imagemin({progressive: true}))
		.pipe(gulp.dest('./build/images/'));
});
*/
// gulp.task('watch', function() {
// 	var watch = require('gulp-watch');

// 	// watch('./dev/*.html', watchBatch(['html']));
// 	//watch('./dev/less/**/*.less', watchBatch(['less']));
// 	// watch('./dev/css/*.css', watchBatch(['style']));
// 	watch('./source/sprite/*.png', watchBatch(['spritesmith']));

// 	// watch('./dev/js/*.js', watchBatch(['js']));
// });

// gulp.task('default', ['watch']);
// /*
// * функция обёртка для gulp-watch
// */
// function watchBatch(arr) {
// 	var batch = require('gulp-batch');
// 	return batch( function(events, done) {
// 		for(var i = 0; i < arr.length; i++) {
// 			gulp.start(arr[i], done);
// 		}
// 	});
// }

function taskLess() {
	return gulp.src('./source/less/*.less')
		.pipe(plumber())
		.pipe(less({
			paths: ['.', 'bower_components']
		}))
		.pipe(gulp.dest('./public/css/'));
}

function taskConnect() {
	connect.server({
		root: 'public',
		livereload: true
	});
}

function taskSprite() {
	let spriteDate = gulp.src('./source/sprite/*.png')
		.pipe(spritesmith({
			imgName: 'sprite.png',
			cssName: 'sprite.less',
			cssFormat: 'less',
			algorithm: 'binary-tree',
			cssTemplate: 'spritesmith.mustache'
		}));

	spriteDate.img.pipe(gulp.dest('./public/images/'));
	return spriteDate.css.pipe(gulp.dest('./source/less/spritesmith/'));
}

function taskPug() {
	return gulp.src('./source/*.pug')
	.pipe(plumber())
	.pipe(pug({
		pretty: '\t'
	}))
	.pipe(gulp.dest('./public/'));
}

function taskImagemin() {
	return gulp.src(['source/images/**/*.jpg', 'source/images/**/*.png', 'source/images/**/*.svg'])
		.pipe(imagemin([
			imagemin.gifsicle({interlaced: true}),
			imagemin.jpegtran({progressive: true}),
			imagemin.mozjpeg({progressive: true}),
			imagemin.optipng({optimizationLevel: 7}),
			imagemin.pngquant({quality: '85-100'})
		]))
		.pipe(gulp.dest('public/images/'));
}