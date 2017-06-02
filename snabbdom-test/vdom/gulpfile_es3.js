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
                filename: "vdom.js"
            },
            entry: {
                index: './src/vdom.js'
            },
            module: {
                loaders: [{
                    test: /\.js$/,
                    loader: 'babel-loader',
                    exclude: /(node_modules|bower_components)/,
                    query: {
                        presets: ["babel-preset-es2015", "babel-preset-stage-0"],
                        "plugins": [
                            ["transform-es2015-modules-commonjs", {
                                loose: true
                            }],
                            "transform-es3-property-literals",
                            "transform-es3-member-expression-literals", [
                                "transform-es2015-classes", {
                                    "loose": true
                                }
                            ],
                            "transform-runtime"
                        ]
                    }
                }]
            }
        }))
        .pipe(gulp.dest("./dist"));
});