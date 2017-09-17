/**
 *
 * Tumblr Boilerplate
 * by Joe Joiner
 *
 */


/*------------------------------------*\
  #INITIAL CONFIG
\*------------------------------------*/

/**
 * Import task runners
 */

var gulp = require('gulp');
var gulpLoadPlugins = require('gulp-load-plugins');
var plugins = gulpLoadPlugins();
var pngquant = require('imagemin-pngquant');
var autoprefixer = require('autoprefixer');
var cssnano = require('cssnano');
var reload = browserSync.reload;


/**
 * Input paths
 */

var paths = {
  src: './src/',
  dist: './dist/',
  html: '**/*.html',
  css: 'css/**/*.css',
  js: 'js/**/*.js',
  img: 'img/**/*.+(png|jpg|svg|gif)'
};





/*------------------------------------*\
  #HTML
\*------------------------------------*/

/**
 * Copy HTML to build folder
 */

gulp.task('html', function() {
  return gulp.src(paths.src + paths.html)
    .pipe(parser({ data: './data.json' }))
    .on('error', errorHandler)
    .pipe(gulp.dest('./', { cwd: paths.dist }))
});

var errorHandler = function (err) {
  console.log('Error: ' + err);
  this.emit('end')
}





/*------------------------------------*\
  #CSS
\*------------------------------------*/

/**
 * Compile CSS
 */

gulp.task('css', function() {
  var postcssPlugins = [
    autoprefixer(),
    cssnano()
  ]

  var cleanCSSOptions = {
    debug: true,
    rebase: false
  }

  return gulp.src(paths.src + paths.css)
    .pipe(plugins.postcss(postcssPlugins))
    .pipe(plugins.cleancss(cleanCSSOptions))
    .pipe(gulp.dest('./css', { cwd: paths.dist }))
    .pipe(browserSync.stream())
});





/*------------------------------------*\
  #IMAGES
\*------------------------------------*/

/**
 * Minify images
 */

gulp.task('img', function() {
  var imageminPlugins = [
    plugins.imagemin.jpegtran({ progressive: true }),
    plugins.imagemin.gifsicle({ interlaced: true }),
    pngquant()
  ]

  return gulp.src(paths.src + paths.img)
    .pipe(plugins.imagemin(imageminPlugins, { verbose: true }))
    .pipe(gulp.dest('./img', { cwd: paths.dist }))
});





/*------------------------------------*\
  #SCRIPT GROUPS
\*------------------------------------*/

/**
 * Compile
 */

gulp.task('dist', ['css', 'html', 'img'])
