var gulp = require("gulp");
var browserify = require("browserify");
var source = require("vinyl-source-stream");
var path = require('path');

var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var streamify = require('gulp-streamify');  

var babel = require("gulp-babel");

gulp.task("JSX",function(){
   gulp.src("./examples/**/*.jsx")
    .pipe(babel({
		presets:["babel-preset-es2015","babel-preset-stage-0", "babel-preset-react"],
		"plugins": [
		  ["transform-es2015-classes", { "loose": true }]
		]	
	}))
	.on('error', function(err){
		console.log(err);	
	})
    .pipe(gulp.dest('./examples'));
});

gulp.task("combine",function(){
    browserify({
        entries : ["./src/Neact.js"],
		standalone : 'Neact'
    })
    .bundle()
    .pipe(source("Neact.js"))
    .pipe(gulp.dest("./dist"))
	.pipe(rename({ suffix: '.min' }))
    .pipe(streamify(uglify()))
    .pipe(gulp.dest('./dist'));
});

//gulp默认命令
gulp.task("default",["combine", 'JSX']);

gulp.watch(["./src/*.js"], function() {
    gulp.run('combine');
});

gulp.watch(["./examples/**/*.jsx"], function() {
    gulp.run('JSX');
});
