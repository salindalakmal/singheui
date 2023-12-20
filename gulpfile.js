
// Defining requirements
const gulp = require('gulp');
const gutil = require('gulp-util');
const postcss = require('gulp-postcss');
const autoprefixer = require('gulp-autoprefixer');
const babel = require('gulp-babel');
const jshint = require('gulp-jshint');
const stylish = require('jshint-stylish');
const plumber = require('gulp-plumber');
const sass = require('gulp-sass')(require('sass'));
const watch = require('gulp-watch');
const cssnano = require('cssnano');
const rename = require('gulp-rename');
const concat = require('gulp-concat');
const terser = require('gulp-terser');
const ignore = require('gulp-ignore');
const rimraf = require('gulp-rimraf');
const imagemin = require('gulp-imagemin');
const pngcrush = require('imagemin-pngcrush');
const gulpif = require('gulp-if');
const sourcemaps = require('gulp-sourcemaps');
const newer = require('gulp-newer');
const cleanCSS = require('gulp-clean-css');
const strip = require('gulp-strip-comments');
const notify = require('gulp-notify');
const browserSync = require('browser-sync').create();;
const reload = browserSync.reload;

//sass.compiler = require('node-sass');

// Set envoironment mode
// var env = process.env.NODE_ENV || 'development';
const env = process.env.NODE_ENV = 'production';

// Defining base pathes
const paths = {
    bower: 'bower_components/',
    node: 'node_modules/',
    dev: 'src/',
    theme: '_html/assets/',
};

// browser-sync watched files
const browserSyncWatchFiles = [
    paths.theme + 'css/**/*.css',
    paths.theme + 'js/**/*.js',
    paths.theme + 'images/**/*.*',
    './**/*.html'
];

// browser-sync options
// see: https://www.browsersync.io/docs/options/
const browserSyncOptions = {
    // proxy: 'localhost/folder',
    open: true,
    // notify: false
    server: './_html'
};


// gulp styles
function styles() {
    return gulp.src(paths.dev + 'scss/**/*.scss')
    .pipe(plumber(function(error) {
        gutil.log(gutil.colors.red(error.message));
        this.emit('end');
    }))
    //.pipe(sourcemaps.init())
    .pipe(sass.sync({
        outputStyle: 'expanded',
        indentType: "tab",
        indentWidth: 1,
        includePaths: [
            paths.bower,
            paths.node,
        ]
    }).on('error', sass.logError))
    .pipe(autoprefixer('last 2 version', '> 1%', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(plumber.stop())
    //.pipe(sourcemaps.write('.', {includeContent: false}))
    .pipe(gulp.dest(paths.theme + 'css'))
    .pipe(reload({stream:true}))
    .pipe(notify({ message: 'Styles task complete', onLast: true }))
};

exports.styles = styles;

// gulp stylesMin
function stylesMin() {
    return gulp.src(paths.dev + 'scss/**/*.scss')
    .pipe(plumber(function(error) {
        gutil.log(gutil.colors.red(error.message));
        this.emit('end');
    }))
    .pipe(sass.sync({
        outputStyle: 'compressed',
        includePaths: [
            paths.bower,
            paths.node,
        ]
    }).on('error', sass.logError))
    .pipe(autoprefixer('last 2 version', '> 1%', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(plumber.stop())
    .pipe(rename({ suffix: '.min' }))
    .pipe(cleanCSS({level: {1: {specialComments: 0}}}))
    .pipe(gulp.dest(paths.theme + 'css'))
    .pipe(reload({stream:true}))
    .pipe(notify({ message: 'Styles task complete', onLast: true }))
};

exports.styles = stylesMin;


// gulp scripts
function scripts() {
    return gulp.src([

        // paths.node + 'jquery-validation/dist/jquery.validate.js',
        // paths.node + 'jquery-validation/dist/additional-methods.js',

        // paths.node + 'owl.carousel/dist/owl.carousel.js',
        // paths.bower + 'fancybox/dist/jquery.fancybox.js',
        paths.node + 'aos/dist/aos.js',
        // paths.node + 'jquery-parallax.js/parallax.js',

        // Grab your custom scripts
        paths.dev + 'scripts/*.js',

    ])
    // .pipe(plumber(function(error) {
    //     gutil.log(gutil.colors.red(error.message));
    //     this.emit('end');
    // }))
    .pipe(plumber())
    // .pipe(sourcemaps.init())
    .pipe(babel({
        // presets: ['es2015'],
        presets: [
            [
                "@babel/env",
                {
                    modules: false
                }
            ]
        ],
        compact: true,
        ignore: ['aos']
    }))
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(concat('app.js'))
    .pipe(strip())
    .pipe(gulp.dest(paths.theme + 'js'))
    .pipe(rename({suffix: '.min'}))
    .pipe(terser())
    // .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.theme + 'js'))
    .pipe(reload({stream: true}));
};

exports.scripts = scripts;


// gulp customScripts
function customScripts() {
    return gulp.src([

        paths.dev + 'scripts/custom/*.js',

    ])
    .pipe(plumber())
    // .pipe(sourcemaps.init())
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(gulp.dest(paths.theme + 'js'))
    .pipe(rename({suffix: '.min'}))
    .pipe(terser())
    // .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.theme + 'js'))
    .pipe(reload({stream: true}));
};

exports.customScripts = customScripts;


// gulp pageScripts
function pageScripts() {
    return gulp.src([

        paths.dev + 'scripts/pages/*.js',

    ])
    .pipe(plumber())
    // .pipe(sourcemaps.init())
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(gulp.dest(paths.theme + 'js/pages'))
    .pipe(rename({suffix: '.min'}))
    .pipe(terser())
    // .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.theme + 'js/pages'))
    .pipe(reload({stream: true}));
};

exports.pageScripts = pageScripts;


// gulp vendorScripts
function vendorScripts() {
    return gulp.src([

        paths.dev + 'scripts/libs/**/*.**',

    ])
    .pipe(gulp.dest(paths.theme + 'js/libs'))
    .pipe(reload({stream: true}));
};

exports.vendorScripts = vendorScripts;

// gulp jsonScripts
function jsonScripts() {
    return gulp.src([

        paths.dev + 'scripts/json/*.json',

    ])
    .pipe(gulp.dest(paths.theme + 'js/json'))
    .pipe(reload({stream: true}));
};

exports.jsonScripts = jsonScripts;


// gulp copyAssets
function copyAssets(done) {

    // Copy all Font Awesome Fonts
    // gulp.src(paths.node + '@fortawesome/fontawesome-free/webfonts/*.{otf,ttf,woff,woff2,eot,svg}')
    // .pipe(gulp.dest(paths.theme + 'fonts'));

    // Copy jQuery
    gulp.src(paths.node + 'jquery/dist/*.**')
    .pipe(gulp.dest(paths.theme + 'js/libs/jquery'));

    // Copy Zurb Foundation
    gulp.src(paths.node + 'foundation-sites/dist/js/*.**')
    .pipe(gulp.dest(paths.theme + 'js/libs/foundation'));

    // Copy What-input
    gulp.src(paths.node + 'what-input/dist/*.**')
    .pipe(gulp.dest(paths.theme + 'js/libs/what-input'));

    // Copy Fancyapps
    // gulp.src(paths.node + '@fancyapps/ui/dist/*.**')
    // .pipe(gulp.dest(paths.theme + 'js/libs/fancyapps'));

    // Copy tippy.js
    // gulp.src(paths.node + 'tippy.js/dist/*.**')
    // .pipe(gulp.dest(paths.theme + 'js/libs/tippy.js'));

    // Copy popperjs
    // gulp.src(paths.node + '@popperjs/core/dist/umd/*.**')
    // .pipe(gulp.dest(paths.theme + 'js/libs/popperjs'));

    // Copy Jqueryui
    // gulp.src(paths.node + 'jqueryui/*.**')
    // .pipe(gulp.dest(paths.theme + 'js/libs/jqueryui'));

    done();

};

exports.copyAssets = copyAssets;


// gulp copyFonts
function copyFonts() {
    return gulp.src(paths.dev + 'fonts/**/*.*')
    .pipe(gulp.dest(paths.theme + 'fonts'))
    .pipe(reload({stream: true}));
};

exports.copyFonts = copyFonts;


// gulp images.
function images() {
    return gulp.src(paths.dev + 'images/**/*.{jpg,jpeg,png,gif,ico,svg}')
    .pipe(newer(paths.theme + 'images'))
    //.pipe(rimraf({ force: true }))
    .pipe(gulpif(env === 'development', imagemin({
        svgoPlugins: [{ removeViewBox: false }],
    })))
    .pipe(gulpif(env === 'production', imagemin({
        optimizationLevel: 7,
        progressive: true,
        interlaced: true,
        svgoPlugins: [{ removeViewBox: false }],
        use: [pngcrush()]
    })))
    .pipe(gulp.dest(paths.theme + 'images'))
    .pipe(reload({stream:true}));
};

exports.images = images;


// gulp browserSync
function browserSyncStart(done) {
    browserSync.init(browserSyncWatchFiles, browserSyncOptions);
    done();
};

exports.browserSync = browserSync;


// gulp watchTask
function watchTask(done){
    gulp.watch(paths.dev + 'scss/**/*.scss', styles);
    //gulp.watch(paths.dev + 'scss/**/*.scss', stylesMin);
    gulp.watch(paths.dev + 'scripts/*.js', scripts);
    gulp.watch(paths.dev + 'scripts/custom/*.js', customScripts);
    gulp.watch(paths.dev + 'scripts/pages/*.js', pageScripts);
    gulp.watch(paths.dev + 'scripts/vendor/*.js', vendorScripts);
    gulp.watch(paths.dev + 'scripts/json/*.json', jsonScripts);
    gulp.watch(paths.dev + 'images/**/*.{jpg,jpeg,png,gif,ico,svg}', images);
    gulp.watch(paths.dev + 'fonts/**/*.*', copyFonts);

    done();
}

// gulp
exports.default = gulp.series(
    styles,
    //stylesMin,
    scripts,
    customScripts,
    pageScripts,
    vendorScripts,
    images,
    jsonScripts,
    copyAssets,
    copyFonts,
    browserSyncStart,
    watchTask
);


