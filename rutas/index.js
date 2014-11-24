requires: {
     var requirejs = require("requirejs");
     var path_module = require("path");
     var data = {
          islogin: false
     };
}

funcionesRutas: {
     exports.index = function(req, res) {
          data = {};

          requirejs([
               __dirname + "/../views/index/indexModule"
          ], function(indexModule) {
               res.render("index/index", data);
          });
     }

     exports.cms = function(req, res) {
          data = {};
          
          requirejs([
               __dirname + "/../views/cms/cmsModule"
          ], function(cmsModule) {
               if(req && req.query && req.query.usuario && req.query.password) {
                    cmsModule.cms.islogin(req, function(response) {
                         data.islogin = true;
                         res.render("cms/cms", data);
                    });
               }

               else {
                    res.render("cms/cms", data);
               }
          });
     }

     exports.especificaciones = function(req, res) {
          requirejs([
               __dirname + "/../views/especificaciones/especificacionesModule"
          ], function(especificacionesModule) {
               if(req.params.tipo){
                    especificacionesModule.especificaciones[req.params.accion](req, function(response) {
                         res.json(response);
                    });                    
               }

               else {
                    especificacionesModule.especificaciones.alta(req, function(response) {
                         res.json(response);
                    });
               }
          });
     }

     exports.productos = function(req, res) {
          requirejs([
               __dirname + "/../views/productos/productosModule"
          ], function(productosModule) {
               productosModule.productos[req.params.accion](req, function(response) {
                    res.json(response);
               });                    
          });
     }
}