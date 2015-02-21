console.log("============== CMS MODULE ==============");

exports.cms = function() {
	var mongoose = require("mongoose");

	var AdminSchema = mongoose.Schema({
		usuario: "String",
		password: "String"
	});

	var Admin = mongoose.model("Admin", AdminSchema);

	return {
            islogin: function(req, callback) {
                Admin.find(req).exec(function(error, response) {
                    if (error) return console.error(error);

                    if(callback) {
                            var response = (response.length > 0)? true : false;

                            callback(response);
                    }
                });
            }
	}
}();