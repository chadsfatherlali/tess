console.log("============== PRODUCTOS MODULE ==============");

exports.productos = function() {
    var mongoose = require("mongoose");
    var modelos = require("../../modelos");

    return {
        obtener: function(req, callback) {
            var REQ = req.query;
            var offset = REQ.offset;
            var obj = {
                categoria: REQ.categoria || {$type: 2},
                tipoproducto: REQ.tipoproducto || {$type: 2}
            };

            modelos.modelo("AltaProducto").find(obj).limit(offset).exec(function(error, response) {
                if(error) return console.error(error);

                if(callback) callback(response);				
            });
        },

        borrar: function(req, callback) {
            var REQ = req.query;
            
            modelos.modelo("AltaProducto").find({referencia: REQ.referencia}).remove().exec(function(error, response) {
                if(error) return console.error(error);

                if(callback) callback(response);
            });
        }
    };
}();

// REVISAR LUEGO:
// db.admins.find({_id: {$gt: 2}}).limit(2)