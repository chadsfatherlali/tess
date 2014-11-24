var gulp = require("gulp");
var server = require("gulp-express");

gulp.task("server", function() {
  	server.run({
		file: "app.js"
	});

 	gulp.watch(["app.js"], [server.run]);
 	gulp.watch(["rutas/**/*.js"], [server.run]);
 	gulp.watch(["views/**/*.*"], [server.run]);
});