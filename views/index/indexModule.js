console.log("============== INDEX MODULE ==============");

exports.index = function() {
    return {
        init: function(callback) {
            var mongoose = require("mongoose");
            var modelos = require("../../modelos");
            var Q = require("q");

            var p0 = modelos.modelo("AltaProducto").find().exec();
            var p1 = modelos.modelo("TipoProducto").find({}, {producto: 1, _id: 0}).exec();
            var p2 = modelos.modelo("Categoria").find({}, {categoria: 1, _id: 0}).exec();

            var allPromise = Q.all([p0, p1, p2]);

            allPromise.then(function(response) { 
                if(callback) callback(response);
            },
            function(error) {
                console.log("error", error);
            });
        }
    };
}();