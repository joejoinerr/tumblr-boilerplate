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
var plugins = require('gulp-load-plugins')();
var pngquant = require('imagemin-pngquant');
var autoprefixer = require('autoprefixer');
var cssnano = require('cssnano');


/**
 * Input paths
 */

var paths = {
  src: './src/',
  tmp: './tmp/',
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

 var errorHandler = function (err) {
   console.log('Error: ' + err);
   this.emit('end')
 }

var inlineSourceOptions = {
  compress: false,
  rootpath: paths.dist
};

gulp.task('html', ['css:dist'], function() {
  return gulp.src(paths.src + paths.html)
    .pipe(plugins.inlineSource(inlineSourceOptions))
    .pipe(plugins.tumblrThemeParser({ data: './tumblr-data.json' }))
    .on('error', errorHandler)
    .pipe(gulp.dest(paths.tmp))
});

gulp.task('html:dist', ['css:dist'], function() {
  return gulp.src(paths.src + paths.html)
    .pipe(plugins.inlineSource(inlineSourceOptions))
    .pipe(gulp.dest(paths.dist))
});





/*------------------------------------*\
  #CSS
\*------------------------------------*/

/**
 * Compile CSS
 */

var postcssPlugins = [
  autoprefixer(),
  cssnano()
]

gulp.task('css:dist', function() {
  return gulp.src(paths.src + paths.css)
    .pipe(plugins.postcss(postcssPlugins))
    .pipe(gulp.dest(paths.dist + 'css/'))
});





/*------------------------------------*\
  #IMAGES
\*------------------------------------*/

/**
 * Minify images
 */

gulp.task('img', function() {
  return gulp.src(paths.src + paths.img)
    .pipe(gulp.dest(paths.tmp + 'img/'))
});

gulp.task('img:dist', ['img'], function() {
  var imageminPlugins = [
    plugins.imagemin.jpegtran({ progressive: true }),
    plugins.imagemin.gifsicle({ interlaced: true }),
    pngquant()
  ]

  return gulp.src(paths.tmp + paths.img)
    .pipe(plugins.imagemin(imageminPlugins, { verbose: true }))
    .pipe(gulp.dest(paths.dist + 'img/'))
});





/*------------------------------------*\
  #SCRIPT GROUPS
\*------------------------------------*/

/**
 * Compile
 */

gulp.task('build', ['html', 'img'])
gulp.task('dist', ['html:dist', 'img'])
