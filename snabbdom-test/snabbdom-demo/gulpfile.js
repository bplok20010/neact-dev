var gulp = require("gulp"),
    babel = require("gulp-babel"),
    es2015 = require("babel-preset-es2015"),
    bp = require("babel-preset-stage-0"),
    webpack = require("gulp-webpack");
var path = require('path');

gulp.task("default", function() {
    gulp.src("./js/*.es6")
        .pipe(babel({
            presets: [es2015, bp, 'babel-preset-react'],
            "plugins": [
                "transform-es3-property-literals",
                "transform-es3-member-expression-literals", ["transform-es2015-modules-commonjs", { "loose": true }],
                //单页测试，暂时不开启
                ["transform-es2015-classes", { "loose": true }], // babel 在使用一些特殊属性时会不支持IE9一下
                "transform-runtime"
            ]
        }))
        .on('error', function(err) {
            console.log(err);
        })
        .pipe(gulp.dest(function(data) {
            return path.dirname(data.history[0]);
        }));
});

gulp.watch(["./vdom2/*.js"], function() {
    gulp.run('webpack3'); // gulp.run('webpack2', ['default', 'webpack']);
});

gulp.task("start", function() {
    gulp.run('webpack2', ['default', 'webpack']);
})

gulp.task("toes3", function() {
    gulp.src("./build/*.js")
        .pipe(babel({
            presets: [es2015, bp, 'babel-preset-react'],
            "plugins": [
                "transform-es3-property-literals",
                "transform-es3-member-expression-literals",
                //单页测试，暂时不开启
                //["transform-es2015-classes", { "loose": true }],// babel 在使用一些特殊属性时会不支持IE9一下
                //"transform-runtime"
            ]
        }))
        .on('error', function(err) {
            console.log(err);
        })
        .pipe(gulp.dest('./'));
});


gulp.task("webpack", function() {
    gulp.src("./js/*.js")
        .pipe(webpack({
            output: {
                filename: "build.js",
                publicPath: './js'
            },
            entry: {
                index: './js/demo1.js'
            },
            stats1: {
                colors: true
            },
            // 新添加的module属性
            module: {
                loaders: [
                    { test: /\.js$/, loader: "es3ify-loader" },
                    { test: /\.css$/, loader: "style!css" },
                    { test: /\.(jpg|png)$/, loader: "url?limit=8192" },
                    { test: /\.scss$/, loader: "style!css!sass" }
                ]
            }
        }))
        .pipe(gulp.dest("./"));
    //包装好的js目录
});

gulp.task("webpack2", function() {
    gulp.src("./js/*.js")
        .pipe(webpack({
            output: {
                filename: "build2.js",
                publicPath: './js'
            },
            entry: {
                index: './js/vdom.js'
            },
            stats1: {
                colors: true
            },
            // 新添加的module属性
            module: {
                loaders: [
                    { test: /\.js$/, loader: "es3ify-loader" },
                    { test: /\.css$/, loader: "style!css" },
                    { test: /\.(jpg|png)$/, loader: "url?limit=8192" },
                    { test: /\.scss$/, loader: "style!css!sass" }
                ]
            }
        }))
        .pipe(gulp.dest("./"));
    //包装好的js目录
});

gulp.task("webpack3", function() {
    gulp.src("./vdom2/*.js")
        .pipe(webpack({
            output: {
                filename: "vdom.js",
                publicPath: './js'
            },
            entry: {
                index: './vdom2/test.js'
            },
            stats1: {
                colors: true
            },
            // 新添加的module属性
            module: {
                loaders: [
                    { test: /\.js$/, loader: "es3ify-loader" },
                    { test: /\.css$/, loader: "style!css" },
                    { test: /\.(jpg|png)$/, loader: "url?limit=8192" },
                    { test: /\.scss$/, loader: "style!css!sass" }
                ]
            }
        }))
        .pipe(gulp.dest("./"));
    //包装好的js目录
});