var gulp = require("gulp");
var server = require("gulp-express");
var sass = require("gulp-ruby-sass");
var minifycss = require("gulp-minify-css");

gulp.task("default", ["server", "watch"], function(){});

gulp.task("server", function() {
    server.run({
        file: "app.js"
    });

    gulp.watch(["app.js"], [server.run]);
    gulp.watch(["rutas/**/*.js"], [server.run]);
    //gulp.watch(["views/**/*.*"], [server.run]);
});

gulp.task("css", function() {
    return gulp.src("assets/sass/*.scss")
        .pipe(sass({style: "expanded"}))
        .pipe(minifycss())
        .pipe(gulp.dest("assets/css"));
});

gulp.task("watch", function() {
    gulp.watch("assets/sass/*.scss", ["css"]);
});