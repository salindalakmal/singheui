(() => {

    'use strict';

    // Set envoironment mode
    //var env = process.env.NODE_ENV || 'development';
    const env = process.env.NODE_ENV = 'production';

    // Defining base pathes
    const paths = {
        node: 'node_modules/',
        dev: 'src/',
        theme: '_html/',
    };

    // browser-sync watched files
    // automatically reloads the page when files changed
    const browserSyncWatchFiles = [
        paths.theme + '**/assets/css/*.min.css',
        paths.theme + '**/assets/js/*.min.js',
        paths.theme + '**/assets/images/**/*.*',
        paths.theme + '**/*.html'
    ];

    // browser-sync options
    // see: https://www.browsersync.io/docs/options/
    const browserSyncOptions = {
        // proxy: 'localhost/_html',
        open: true,
        // notify: false
        server: './_html'
    };

    // Defining requirements
    const
        gulp = require('gulp'),
        gutil = require('gulp-util'),
        jshint = require('gulp-jshint'),
        stylish = require('jshint-stylish'),
        plumber = require('gulp-plumber'),
        postcss = require('gulp-postcss'),
        sass = require('gulp-sass')(require('sass')),
        watch = require('gulp-watch'),
        rename = require('gulp-rename'),
        concat = require('gulp-concat'),
        uglify = require('gulp-uglify'),
        imagemin = require('gulp-imagemin'),
        pngcrush = require('imagemin-pngcrush'),
        gulpif = require('gulp-if'),
        sourcemaps = require('gulp-sourcemaps'),
        newer = require('gulp-newer'),
        notify = require('gulp-notify'),
        browserSync = require('browser-sync').create(),
        reload = browserSync.reload;

    // Run:
    // gulp styles
    function styles() {
        const tailwindcss = require('tailwindcss');

        return gulp.src(paths.dev + 'styles/**/*.scss')
        .pipe(plumber(function(error) {
            gutil.log(gutil.colors.red(error.message));
            this.emit('end');
        }))
        .pipe(sourcemaps.init())
        .pipe(sass({
            // outputStyle: 'compressed',
            // outputStyle: 'compact',
            // outputStyle: 'nested',
            outputStyle: 'expanded',
            indentType: "tab",
            indentWidth: 1,
            includePaths: [
                paths.node,
            ]
        }))
        .pipe(gulp.dest(paths.theme + 'assets/css'))
        .pipe(postcss([
            tailwindcss('./tailwind.config.js'),
            require('autoprefixer'),
        ]))
        .pipe(plumber.stop())
        .pipe(sourcemaps.write('.', {includeContent: false}))
        .pipe(gulp.dest(paths.theme + 'assets/css'))
        .pipe(reload({stream:true})) // Inject Styles when min style file is created
        .pipe(notify({ message: 'Styles task complete', onLast: true }))
    };

    exports.styles = styles;


    function html(){
        return gulp.src(paths.dev + 'html/**/*.html')
        .pipe(gulp.dest(paths.theme))
        .pipe(reload({stream: true}))
    };

    exports.html = html;


    // Run:
    // gulp scripts
    function scripts() {
        return gulp.src([

            // Grab your custom scripts
            paths.dev + 'scripts/*.js',

        ])
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(concat('app.js'))
        .pipe(gulp.dest(paths.theme + 'assets/js'))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(sourcemaps.write('.')) // Creates sourcemap for minified JS
        .pipe(gulp.dest(paths.theme + 'assets/js'))
        .pipe(reload({stream: true}));
    };

    exports.scripts = scripts;


    // Run:
    // gulp copyAssets
    function copyAssets(done) {

        // Copy all Font Awesome Fonts
        gulp.src(paths.node + '@fortawesome/fontawesome-free/webfonts/**/*.{otf,ttf,woff,woff2,eot,svg}')
        .pipe(gulp.dest(paths.theme + 'assets/fonts'));

        // Copy AOS
        gulp.src(paths.node + 'aos/dist/aos.js')
        .pipe(gulp.dest(paths.theme + 'assets/js/libs/aos'));

        done();

    };

    exports.copyAssets = copyAssets;


    // Run:
    // gulp copyFonts
    function copyFonts() {
        return gulp.src(paths.dev + 'fonts/**/*.*')
        .pipe(gulp.dest(paths.theme + 'assets/fonts'))
        .pipe(reload({stream: true}));
    };

    exports.copyFonts = copyFonts;


    // Run:
    // gulp images.
    function images() {
        return gulp.src(paths.dev + 'images/**/*.{jpg,jpeg,png,gif,ico,svg}')
        .pipe(newer(paths.theme + 'assets/images'))
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
        .pipe(gulp.dest(paths.theme + 'assets/images'))
        .pipe(reload({stream:true}));
    };

    exports.images = images;


    // Run:
    // gulp browserSync
    // Starts browser-sync task for starting the server.
    function browserSyncStart(done) {
        browserSync.init(browserSyncWatchFiles, browserSyncOptions);
        done();
    };

    exports.browserSync = browserSync;


    // Run:
    // gulp watchTask
    function watchTask(done){
        gulp.watch(paths.dev + 'html/**.html', gulp.series(html, styles));
        gulp.watch(paths.dev + 'styles/**/*.scss', styles);
        gulp.watch(paths.dev + 'scripts/*.js', scripts);
        gulp.watch(paths.dev + 'images/**/*.{jpg,jpeg,png,gif,ico,svg}', images);
        gulp.watch(paths.dev + 'fonts/**/*.*', copyFonts);

        done();
    }

    // Run:
    // gulp
    exports.default = gulp.series(
        html,
        styles,
        scripts,
        images,
        copyAssets,
        copyFonts,
        browserSyncStart,
        watchTask
    );

})();

