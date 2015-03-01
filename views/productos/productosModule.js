console.log("============== PRODUCTOS MODULE ==============");

exports.productos = function() {
    var mongoose = require("mongoose");
    var modelos = require("../../modelos");
    var filemanagergdrive = require("../../helpers/gdrive");

    return {
        obtener: function(req, callback) {
            var REQ = req.query;
            var offset = REQ.offset;
            /*var obj = {
                categoria: REQ.categoria || {$type: 2},
                tipoproducto: REQ.tipoproducto || {$type: 2}
            };*/
            
            modelos.modelo("AltaProducto").find(REQ).limit(offset).exec(function(error, response) {
                if(error) return console.error(error);

                if(callback) callback(response);				
            });
        },
        
        alta: function(req, callback) {
            var REQ = req.body;
            var data = {};
            
            modelos.modelo("AltaProducto").find({referencia: REQ.referencia}).exec(function(error, response) {
                if(error) return console.error(error);

                if(response.length > 0 && !REQ._id) {
                    data.success = false;
                    data.reason = "El producto ya existe";

                    if(callback) callback(data);
                }
                
                else {
                    var testimg = /(http|https):\/\/googledrive.com\/host\/(\w)+/.test(REQ.archivo);

                    filemanagergdrive.manager.upload(REQ, testimg, function(archivo, idimg) {
                        REQ.archivo = archivo;
                        REQ.idimg = idimg;

                        modelos.modelo("AltaProducto").create(REQ, function(error, response) {
                            if(error) {
                                try {
                                    modelos.modelo("AltaProducto").update({_id: REQ._id}, {$set: REQ}, function(err, res) {
                                        if(err) return console.error(err);
                                    });
                                }

                                catch(err) {
                                    return console.error(err);	
                                }
                            }

                            data.success = true;
                            data.reason = "Procesado correctamente";

                            if(callback) callback(data);
                        });
                    });
                }
            });
        },

        borrar: function(req, callback) {
            var REQ = req.query;
            
            filemanagergdrive.manager.delete(REQ, function() {
                modelos.modelo("AltaProducto").find({referencia: REQ.referencia}).remove().exec(function(error, response) {
                    if(error) return console.error(error);

                    if(callback) callback(response);
                });
            });
        },
        
        busquedatexto: function(req, callback) {
            var REQ = req.params.busqueda;
            var regexp = new RegExp(REQ, "i");
            
            modelos.modelo("BusquedaTexto").find({value: regexp}, {value: 0}).exec(function(error, response) {
                if(error) return console.error(error);
                
                var ids = new Array();
                
                for(id in response) {
                    ids.push(response[id]._id);
                }
                
                if(callback) callback(ids);
            });
        }
    };
}();

// REVISAR LUEGO:
// db.admins.find({_id: {$gt: 2}}).limit(2)