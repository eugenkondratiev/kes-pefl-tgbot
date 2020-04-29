const fs = require('fs');
const c = require('./constants');
const {
    task,
    src,
    dest,
    series,
    parallel,
    watch
} = require('gulp');
// const gulp = require('gulp');
const sass = require('gulp-sass'),
    clean = require('gulp-clean'),
    // uglify = require('gulp-uglify'),
    uglifyEs = require('gulp-uglify-es').default,
    uglify = require('gulp-uglify'),
    csso = require('gulp-csso'),
    postcss = require('gulp-postcss'),
    cssnano = require('cssnano'),
    gulpif = require('gulp-if'),
    cache = require('gulp-cache'),
    tap = require('gulp-tap'),
    babelify = require('babelify'),
    browserify = require('browserify'),
    source = require("vinyl-source-stream"),

    buffer = require('gulp-buffer'),
    // const csso = require('csso');
    concat = require('gulp-concat'),
    sourcemaps = require('gulp-sourcemaps'),
    babel = require('gulp-babel'),
    cssimport = require("gulp-cssimport"),

    autoprefixer = require('gulp-autoprefixer');

// console.log(c.DEST_FILES_PATH);

task('clean', () => src(c.DEST_FILES_PATH, { read: false })
    .pipe(clean())
);

task('css', () =>
    // src(c.cssfiles)
    src(c.CSS_PATH + 'stat.scss')
        .pipe(sourcemaps.init())
        .pipe(cssimport())
        .pipe(gulpif("*.{sass,scss}",sass()))
        .pipe(autoprefixer({ cascade: false }))
        .pipe(csso())
        .pipe(concat('stat.min.css'))
        .pipe(sourcemaps.write('.'))
        .pipe(dest(c.DEST_PATH))
)

// task('scripts', () => src(c.scripts)

task('es6scripts', () =>
    browserify(c.SRC_PATH + 'stat.js')

        .transform("babelify", {
            presets: [
                [
                    "@babel/preset-env",
                    {
                        "useBuiltIns": "entry",
                        "corejs": {
                            "version": 3,
                            "proposals": true
                        }
                    }
                ],
                ["minify"]
            ],
            plugins: [
                [
                    "@babel/transform-runtime"
                ],
                "@babel/plugin-transform-arrow-functions",
                "@babel/plugin-transform-modules-commonjs",
                "@babel/plugin-transform-destructuring",
                "@babel/plugin-transform-literals",
                [
                    "@babel/plugin-transform-template-literals",
                    {
                        "loose": true
                    }
                ]
            ]
        })

        .bundle()
        .pipe(source("stat.min.js"))
        .pipe(buffer())
        // .pipe(uglifyEs())
        .pipe(uglify())
        .pipe(dest(c.DEST_PATH))
    // .pipe(uglifyEs())
    // .pipe(fs.createWriteStream(c.DEST_PATH + "stat.min.js"))

)

task('scripts', () => src(c.SRC_PATH + 'stat.js')
    .pipe(sourcemaps.init())
    // .pipe(gulpif("!*.min.js", babel()))
    // .pipe( babel())

    /**/
    .pipe(babel({
        presets: [
            [
                "@babel/preset-env",
                {
                    "useBuiltIns": "entry",
                    "corejs": {
                        "version": 3,
                        "proposals": true
                    }
                }
            ],
            ["minify"]
        ],
        plugins: [
            [
                "@babel/transform-runtime"
            ],
            "@babel/plugin-transform-arrow-functions",
            "@babel/plugin-transform-modules-commonjs",
            "@babel/plugin-transform-destructuring",
            "@babel/plugin-transform-literals",
            [
                "@babel/plugin-transform-template-literals",
                {
                    "loose": true
                }
            ]
        ]
    })
    )
    .pipe(tap(function (file) {
        file.contents = browserify(file.path, { debug: true }).bundle();

    }))
    .pipe(buffer())
    .pipe(uglifyEs())
    .pipe(concat("stat.min.js"))
    .pipe(sourcemaps.write('.'))
    .pipe(dest(c.DEST_PATH))

)

task('images', () =>
    src(c.SRC_PATH + 'images/*')
        .pipe(dest(c.DEST_PATH))
)

task('css:watch', () =>
    watch(c.SRC_PATH + '**/*.{css,sass,scss}', series('css'))
);
task('scripts:watch', () =>
    watch(c.SRC_PATH + '**/*.js', series('scripts'))
);
task('es6scripts:watch', () =>
    watch(c.SRC_PATH + '**/*.js', series('es6scripts'))
);
task('images:watch', () =>
    watch(c.SRC_PATH + 'images/*.*', series('images'))
);

task('default', series('clean',
    parallel(
        series('css', 'css:watch'),
        series('images', 'images:watch'),
        series('es6scripts', 'es6scripts:watch')
        // series('scripts', 'scripts:watch')
    )
)
);