"use strict"

// Gulp

const gulp = require('gulp');

// NPM plugins
const path = require('path');
const del = require('del');
const multipipe = require('multipipe');
const bs = require('browser-sync').create();


//Gulp plugins
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const gulpif = require('gulp-if');
const debug = require('gulp-debug');
const autoprefixer = require('gulp-autoprefixer');
const imagemin = require('gulp-imagemin');
const tinypng = require('gulp-tinypng');
const newer = require('gulp-newer');
const remember = require('gulp-remember');
const concat = require('gulp-concat');
const cached = require('gulp-cached');
const cssnano = require('gulp-cssnano');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');
const notify = require('gulp-notify');
const svgsprite = require('gulp-svg-sprites');
const rigger = require('gulp-rigger');
const htmlminify = require('gulp-html-minify');
const svg2png = require('gulp-svg2png');
const spritesmith = require("gulp.spritesmith");
//const stripCssComments = require('gulp-strip-css-comments');
//const csscomb 	       = require('gulp-csscomb');
const combineMq = require('gulp-combine-mq');

const isDevelopment = !process.env.NODE_ENV || process.env.NODE_END == 'development';


const assets = {
    scss: [
        'src/main.scss',
        'src/sass/blocks/*.{sass,scss}',
        'src/sass/lib/*.{css,scss,sass}',
        'src/sass/sprite/*.{css,scss,sass}',
        'src/sass/util/*.{scss,sass}'
    ],
    html: [
        'src/html/index.html',
        'src/html/tmp/*.html'
    ],
}




gulp.task('sass', function() {
    return gulp.src('src/sass/*.*')
        .pipe(gulpif(isDevelopment, sourcemaps.init()))
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulpif(isDevelopment, sourcemaps.write()))
        .pipe(gulp.dest('public/css'))
        .pipe(combineMq())
        .pipe(cssnano())
        .pipe(rename({
            basename: 'app',
            suffix: '.min'
        }))
        .pipe(gulp.dest('public/css'))
});


gulp.task('html', function() {
    return gulp.src(assets.html[0])
        .pipe(rigger())
        .pipe(htmlminify())
        .pipe(gulp.dest('public'));
});


gulp.task('js', function() {
    return gulp.src('src/js/**/*.js')
        .pipe(concat('app.js'))
        .pipe(gulp.dest('public/js'))
        .pipe(uglify())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('public/js'))
});


gulp.task('img', function() {
    return gulp.src(['src/img/**/*.{jpg,jpeg,svg,png}', '!src/img/icon/*.*'], {
            since: gulp.lastRun('img')
        })
        .pipe(imagemin([
            imagemin.gifsicle({
                interlaced: true
            }),
            imagemin.jpegtran({
                progressive: true
            }),
            imagemin.optipng({
                optimizationLevel: 20
            }),
            imagemin.svgo({
                plugins: [{
                    removeViewBox: true
                }, {
                    cleanupIDs: false
                }]
            })
        ]))
        .pipe(gulp.dest('public/img'))
});


gulp.task('sprite:svg', function() {
    return gulp.src('src/img/icon/*.svg')
        .pipe(svgsprite({
            cssFile: "sprite_svg.css",
            svg: {
                sprite: "sprite.svg"
            },
            pngPath: 'sprite/%f',
            svgPath: 'sprite/%f'
        }))
        .pipe(gulpif('*.css', gulp.dest('src/sass/sprite/')))
        .pipe(gulpif('*.svg', gulp.dest('public/css/sprite')))
        // .pipe(svg2png())
        // .pipe(rename({
        // 	basename: 'png_sprite'
        // }))
        //   .pipe(gulp.dest('public/css/sprite'))
})


gulp.task('sprite:png', function() {
    return gulp.src('src/img/icon/*.png')
        .pipe(spritesmith({
            imgName: 'sprite_png.png',
            cssName: 'sprite_png.css',
            imgPath: 'sprite/sprite_png.png'
        }))
        .pipe(gulpif('*.css', gulp.dest('src/sass/sprite/')))
        .pipe(gulpif('*.png', gulp.dest('public/css/sprite')))
});



gulp.task('server', function() {
    bs.init({
        server: 'public',
        tunnel: 'mysite',
        notify: false,
    });

    bs.watch(['public/**/*.*']).on('change', bs.reload)
});


gulp.task('build:img', gulp.series('img', 'sprite:svg', 'sprite:png'));


gulp.task('watch', function() {
    gulp.watch('public/css/main.css', gulp.series('sass'));
    gulp.watch(assets.html, gulp.series('html'));
    gulp.watch('src/js/**', gulp.series('js'));
    gulp.watch('src/img/**', gulp.series('build:img'));
})


gulp.task('build', gulp.series('build:img', 'sass', 'js', 'html', gulp.parallel('watch', 'server')));