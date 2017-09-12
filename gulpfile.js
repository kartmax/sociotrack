var gulp           = require('gulp'),
	gutil          = require('gulp-util' ),
	sass           = require('gulp-sass'),
	browserSync    = require('browser-sync'),
	concat         = require('gulp-concat'),
	uglify         = require('gulp-uglify'),
	cleanCSS       = require('gulp-clean-css'),
	rename         = require('gulp-rename'),
	del            = require('del'),
	imagemin       = require('gulp-imagemin'),
	cache          = require('gulp-cache'),
	autoprefixer   = require('gulp-autoprefixer'),
	bourbon        = require('node-bourbon'),
	ftp            = require('vinyl-ftp'),
	notify         = require("gulp-notify"),
	spritesmith	   = require('gulp.spritesmith'),
	svgSprite      = require('gulp-svg-sprites');

// Скрипты проекта
gulp.task('scripts', function() {
	return gulp.src([
		'app/libs/jquery/dist/jquery.min.js',
        // 'app/libs/slimmenu-master/dist/js/jquery.slimmenu.min.js',
        // 'app/libs/wow/wow.min.js',
        'app/libs/magnific-popup/dist/jquery.magnific-popup.min.js',
        // 'app/libs/owl.carousel/dist/owl.carousel.min.js',
        // 'app/libs/jqueryformstyle/jquery.formstyler.min.js',
        // 'app/libs/mixtup/mixitup.min.js',


		'app/js/common.js' // Всегда в конце
	])
		.pipe(concat('scripts.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest('app/js'))
		.pipe(browserSync.reload({stream: true}));
});

gulp.task('spritepng', function () {
    var spriteData = gulp.src('app/img/for-sprite-png/*.png').pipe(spritesmith({
        imgName: 'sprite-png.png',
        cssName: '_sprite-png.scss'
    }));
    return spriteData.pipe(gulp.dest('app/img'));
});

gulp.task('spritesvg', function () {
    return gulp.src('app/img/for-sprite-svg/*.svg')
        .pipe(svgSprite({
			mode: "symbols"
        }))
        .pipe(gulp.dest("app/img/"));
});

gulp.task('browser-sync', function() {
	browserSync({
		server: {
			baseDir: 'app'
		},
		notify: true,
		// tunnel: true,
		// tunnel: "projectmane", //Demonstration page: http://projectmane.localtunnel.me
	});
});

gulp.task('sass', function() {
	return gulp.src('app/sass/**/*.scss')
		.pipe(sass({
			includePaths: bourbon.includePaths
		}).on("error", notify.onError()))
		.pipe(rename({suffix: '.min', prefix : ''}))
		.pipe(autoprefixer(['last 15 versions']))
		.pipe(cleanCSS())
		.pipe(gulp.dest('app/css'))
		.pipe(browserSync.reload({stream: true}));
});

gulp.task('watch', ['sass', 'scripts', 'browser-sync'], function() {
	gulp.watch('app/sass/**/*.scss', ['sass']);
	gulp.watch(['libs/**/*.js', 'app/js/common.js'], ['scripts']);
	gulp.watch('app/*.html', browserSync.reload);
});

gulp.task('imagemin', function() {
	return gulp.src(['!app/img/for-sprite-svg/*', '!app/img/for-sprite-png/*', 'app/img/**/*+(.png|jpg|svg)'])
		.pipe(cache(imagemin()))
		.pipe(gulp.dest('dist/img'));
});

gulp.task('build', ['removedist', 'imagemin', 'sass', 'scripts'], function() {

	var buildFiles = gulp.src([
		'app/*.html',
		'app/.htaccess',
	]).pipe(gulp.dest('dist'));

	var buildCss = gulp.src([
		'app/css/main.min.css',
	]).pipe(gulp.dest('dist/css'));

	var buildJs = gulp.src([
		'app/js/scripts.min.js',
	]).pipe(gulp.dest('dist/js'));

	var buildFonts = gulp.src([
		'app/fonts/**/*',
	]).pipe(gulp.dest('dist/fonts'));

});

gulp.task('deploy', function() {

	var conn = ftp.create({
		host:      'hostname.com',
		user:      'username',
		password:  'userpassword',
		parallel:  10,
		log: gutil.log
	});

	var globs = [
		'dist/**',
		'dist/.htaccess',
	];
	return gulp.src(globs, {buffer: false})
		.pipe(conn.dest('/path/to/folder/on/server'));

});

gulp.task('removedist', function() { return del.sync('dist'); });
gulp.task('clearcache', function () { return cache.clearAll(); });

gulp.task('default', ['watch']);
