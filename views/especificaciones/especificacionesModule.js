console.log("============== ESPECIFICACIONES MODULE ==============");

exports.especificaciones = function() {
    var modelos = require("../../modelos");

    return {
        obtener: function(req, callback) {
            var REQ = req.params;

            modelos.modelo(REQ.tipo).find({}).exec(function(error, response) {
                if(error) return console.error(error);

                if(callback) callback(response);
            });
        },

        alta: function(req, callback) {
            var data = {};
            var REQ = req.body;

            /*
            Si no existe la referencia es el alta de una especificación.
             */
            if(!REQ.referencia) {
                var tipo = REQ.tipo;

                delete REQ.tipo;

                modelos.modelo(tipo).find(REQ).exec(function(error, response) {
                    if(error) return console.error(error);

                    if(response.length > 0) {
                        data.success = false;
                        data.reason = "La referencia ya existe";

                        if(callback) callback(data);
                    }

                    else {
                        modelos.modelo(tipo).create(REQ, function(error, response) {
                            if(error) return console.error(error);

                            data.success = true;
                            data.reason = "Procesado correctamente";

                            if(callback) callback(data);
                        });
                    }
                });
            }

            else {
                modelos.modelo(REQ.tipo).find({referencia: REQ.referencia}).exec(function(error, response) {
                    if(error) return console.error(error);

                    if(response.length > 0 && !REQ._id) {
                        data.success = false;
                        data.reason = "El producto ya existe";

                        if(callback) callback(data);
                    }

                    else {
                        modelos.modelo(REQ.tipo).create(REQ, function(error, response) {
                            if(error) {
                                try {
                                    modelos.modelo(REQ.tipo).update({_id: REQ._id}, {$set: REQ}, function(err, res) {
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
                    }
                });
            }
        },

        borrar: function(req, callback) {
            var REQ = req.query;
            
            modelos.modelo(req.params.tipo).find({_id: REQ._id}).remove().exec(function(error, response) {
                if(error) return console.error(error);

                if(callback) callback(response);
            });
        }
    };
}();