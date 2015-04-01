var gulp = require("gulp");
var sass = require("gulp-sass");
var minifycss = require("gulp-minify-css");
var nodemon = require("gulp-nodemon");

gulp.task("default", ["server", "sass"], function(){});

gulp.task("server", function() {
    nodemon({
            script: "app.js",
            ext: "html js"
        })
        .on("restart", function () {
            console.log("Reinicia!!!");
        });
    
    //server.run(["app.js"]);
    //gulp.watch(["app.js"], [server.run]);
    //gulp.watch(["rutas/**/*.js"], [server.run]);
    //gulp.watch(["views/**/*.*"], [server.run]);
});

gulp.task("sass", function() {
    gulp.watch("assets/sass/*.scss", ["css"]);
});

gulp.task("css", function() {
    gulp.src("assets/sass/*.scss")
        .pipe(sass({errLogToConsole: true}))
        .pipe(sass({style: "compressed"}))
        .pipe(minifycss())
        .pipe(gulp.dest("assets/css"));
});