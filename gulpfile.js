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

gulp.task('html', ['css'], function() {
    var inlineSourceOptions = {
      compress: false,
      rootpath: paths.dist
    };

  return gulp.src(paths.src + paths.html)
    .pipe(plugins.inlineSource(inlineSourceOptions))
    .pipe(plugins.tumblrThemeParser({ data: './data.json' }))
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

  return gulp.src(paths.src + paths.css)
    .pipe(plugins.postcss(postcssPlugins))
    .pipe(gulp.dest('./css', { cwd: paths.dist }))
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

gulp.task('dist', ['html', 'img'])
