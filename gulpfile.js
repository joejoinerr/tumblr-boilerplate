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
var browserSync = require('browser-sync').create();
var autoprefixer = require('autoprefixer');
var cssnano = require('cssnano');
var brandColors = require('postcss-brand-colors');
var reload = browserSync.reload;


/**
 * Input paths
 */

var paths = {
  src: './src/',
  tmp: './.tmp/',
  dist: './dist/',
  html: '**/*.html',
  sass: 'sass/**/*.scss',
  css: 'css/**/*.css',
  js: 'js/**/*.js',
  img: 'img/**/*.+(png|jpg|svg|gif)'
};





/*------------------------------------*\
  #HTML
\*------------------------------------*/

/**
 * Render HTML
 */

gulp.task('njk', function() {
  return gulp.src(paths.src + '**/*.njk')
    .pipe(plugins.nunjucksRender({
      path: ['src']
    }))
    .pipe(gulp.dest('./', { cwd: paths.tmp }))
});

/**
 * Copy HTML to tmp folder
 */

gulp.task('html', function() {
  return gulp.src(paths.src + paths.html)
    .pipe(gulp.dest('./', { cwd: paths.tmp }))
});


/**
 * Copy HTML to build folder
 */

gulp.task('html:dist', ['njk', 'html'], function() {
  return gulp.src(paths.tmp + paths.html)
    .pipe(gulp.dest('./', { cwd: paths.dist }))
});





/*------------------------------------*\
  #CSS
\*------------------------------------*/

/**
 * Compile sass
 */

gulp.task('sass', function() {
  var sassOptions = {
    errLogToConsole: true,
    includePaths: ['./node_modules'],
    outputStyle: 'expanded',
    precision: 2
  };

  var postcssPlugins = [
    brandColors(),
    autoprefixer(),
    cssnano()
  ]

  return gulp.src(paths.src + paths.sass)
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.sass(sassOptions).on('error', plugins.sass.logError))
    .pipe(plugins.postcss(postcssPlugins))
    .pipe(plugins.sourcemaps.write('./maps', { cwd: paths.tmp }))
    .pipe(gulp.dest('./css', { cwd: paths.tmp }))
    .pipe(browserSync.stream())
});


/**
 * Lint Sass
 */

gulp.task('lint', function() {
  // Options vars
  var scssLintOptions = {
    config: 'scss-lint.yml',
  }

  return gulp.src(paths.src + paths.sass)
    .pipe(plugins.cached('plugins.scssLint'))
    .pipe(plugins.scssLint(scssLintOptions))
});


/**
 * Minify CSS
 */

gulp.task('css:dist', ['sass'], function() {
  var cleanCSSOptions = {
    debug: true,
    rebase: false
  }

  return gulp.src(paths.tmp + paths.css)
    .pipe(plugins.cleancss(cleanCSSOptions))
    .pipe(plugins.rev())
    .pipe(gulp.dest('./css', { cwd: paths.dist }))
    .pipe(plugins.rev.manifest({
      base: paths.dist,
      merge: true
    }))
    .pipe(gulp.dest('./css', { cwd: paths.dist }))
});





/*------------------------------------*\
  #IMAGES
\*------------------------------------*/

/**
 * Copy images
 */

gulp.task('img', function() {
  return gulp.src(paths.src + paths.img)
    .pipe(gulp.dest('./img', { cwd: paths.tmp }))
});


/**
 * Minify images
 */

gulp.task('img:dist', ['img'], function() {
  var imageminPlugins = [
    plugins.imagemin.jpegtran({ progressive: true }),
    plugins.imagemin.gifsicle({ interlaced: true }),
    pngquant()
  ]

  return gulp.src(paths.tmp + paths.img)
    .pipe(plugins.imagemin(imageminPlugins, { verbose: true }))
    .pipe(gulp.dest('./img', { cwd: paths.dist }))
});





/*------------------------------------*\
  #SERVER
\*------------------------------------*/

/**
 * Create servera and watch files
 */

gulp.task('serve', ['sass', 'html', 'njk', 'img'], function() {
  browserSync.init({
    server: {
      baseDir: paths.tmp
    }
  });

  gulp.watch(paths.sass, { cwd: paths.src }, ['sass']);
  gulp.watch(paths.html, { cwd: paths.src }, ['html']);
  gulp.watch(paths.html, { cwd: paths.tmp }).on('change', reload);
});





/*------------------------------------*\
  #SCRIPT GROUPS
\*------------------------------------*/

/**
 * Temporary compile
 */

gulp.task('compile', ['sass', 'html', 'njk', 'img'])


/**
 * Compile for production and version files
 */

gulp.task('dist', ['css:dist', 'html:dist', 'img:dist'], function() {
  var manifest = gulp.src(paths.dist + 'rev-manifest.json')

  return gulp.src(paths.tmp + paths.html)
    .pipe(plugins.revReplace({
      manifest: manifest,
      replaceInExtensions: ['.html']
    }))
    .pipe(gulp.dest(paths.dist))
});
