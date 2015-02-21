console.log("============== CRON MODULE ==============");

exports.job = function() {
    return {
        init: function() {
            var mongoose = require("mongoose");
            var modelos = require("../modelos");
            var reduce = {};
            
            reduce.verbose = true;
            
            reduce.out = {replace: "textsearchs"};
            
            reduce.map = function() {
                var texto = this.categoria + "," + this.tipoproducto + "," + this.caracteristicas + "," + this.subtitulo;
                
                emit(this._id, texto);
            };
            
            reduce.reduce = function(id, busqueda) {};
            
            modelos.modelo("AltaProducto").mapReduce(reduce, function (err, results) {
                console.log("==================================================");
                console.log("==================================================");
                console.log(results);
                console.log("error", err);
            });
        }
    };
}();
