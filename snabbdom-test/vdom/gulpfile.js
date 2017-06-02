var gulp = require("gulp"),
    babel = require("gulp-babel"),
    es2015 = require("babel-preset-es2015"),
    stage0 = require("babel-preset-stage-0"),
    webpack = require("gulp-webpack");
var path = require('path');


gulp.watch(["./src/*.js"], function() {
    gulp.run('boundle');
});


gulp.task("boundle", function() {
    gulp.src("./src/*.js")
        .pipe(webpack({
            output: {
                filename: "test.js",
                publicPath: './js'
            },
            entry: {
                index: './src/test.js'
            },
            module: {
                loaders: [
                    { test: /\.js$/, loader: "es3ify-loader" },
                    { test: /\.css$/, loader: "style!css" },
                    { test: /\.(jpg|png)$/, loader: "url?limit=8192" },
                    { test: /\.scss$/, loader: "style!css!sass" }
                ]
            }
        }))
        .pipe(gulp.dest("./dist"));
    //包装好的js目录
});