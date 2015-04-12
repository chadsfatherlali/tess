"use strict";

var _tess = angular.module("App", [
     "ngRoute",
     "ui.bootstrap",
     "_directives_",
     "ngProgress"
]);

_tess.config([
    "$interpolateProvider",
    "$routeProvider", 
    "$controllerProvider", 
    "$httpProvider",

    function($interpolateProvider, $routeProvider, $controllerProvider, $httpProvider) {
        _tess.components = {
            controller: $controllerProvider.register
        };

        $httpProvider.interceptors.push("httpInterceptor");
        $interpolateProvider.startSymbol("[[").endSymbol("]]");

        $routeProvider
            .when("/index", {
                templateUrl: "assets/ngviews/index/index.html"
            })
            .when("/producto/:_id",
                {
                    templateUrl: "/assets/ngviews/producto/producto.html",
                    controller: "producto"
                }
            )
            .otherwise({redirectTo: "/index"});
   }
]);

_tess.controller("mainController", function($rootScope, $scope, $routeParams, $location, $window, $http, $q, $route) {
     $rootScope.FB;
     $scope.altaproducto = {};

     $scope.$on("$routeChangeError", function(next, current) { 
          console.log("APP LOCATION STATUS: KO");
     });                 

     $scope.$on("$routeChangeSuccess", function(next, current) { 
          console.log("APP LOCATION STATUS: OK");
     });
});

_tess.filter("generateid", function() {
   return function(string) {
       return string + "-"  + Math.floor(Math.random() * 9999) + 1000;
   }
});

_tess.directive("compra", function($http) {
    return {
        restrict: "A",
        transclude: true,
        templateUrl: "assets/ngviews/producto/compra.html",

        link: function(scope, element, attr) {}
    }
});

_tess.factory("httpInterceptor", function($rootScope) {
    //ngProgress.color("#5cb85c");
    
    return {
        "request": function(config) {
            $rootScope.$broadcast("starthttprequest");
            return config;
        },

       "requestError": function(rejection) {
            if(canRecover(rejection)) {
              return responseOrNewPromise;
            }

            return $q.reject(rejection);
       },

        "response": function(response) {
            $rootScope.$broadcast("completehttprequest");
            return response;
        },

       "responseError": function(rejection) {
            if (canRecover(rejection)) {
                return responseOrNewPromise;
            }
            
           return $q.reject(rejection);
        }
    };
});

_tess.factory("carritoCompras", function($rootScope) {

    function setLocalStorage(key, obj) {
        localStorage.setItem(key, JSON.stringify(obj));
    }

    function getLocalStorage(key) {
        return JSON.parse(localStorage.getItem(key));
    }

    return {
        crear: function (id) {
            var carritoKey = "carrito" + id;
            var obj = {__id: id, compras: {}};

            if (!getLocalStorage(carritoKey)) setLocalStorage(carritoKey, obj);
        },

        get: function(id) {
            var carritoKey = "carrito" + id;
            var obj = getLocalStorage(carritoKey) || {};

            return obj;
        },

        update: function (id, compra, referencia) {
            var carritoKey = "carrito" + id;
            var obj = getLocalStorage(carritoKey) || {};

            if(!obj.compras) obj.compras = {};
            if(!obj.compras[referencia]) obj.compras[referencia] = [];

            obj.compras[referencia] = compra;

            setLocalStorage(carritoKey, obj);

            $rootScope.$broadcast("updateSideBarCarritoCompra", obj);
        }
    }
});

_tess.factory("objReorder", function() {
    return {
        do: function(obj) {
            var orderObj = {};
            var aux = 0;

            _.mapObject(obj, function(v, k) {
                if(isNaN(k)) {
                    orderObj[k] = v;
                }

                else {
                    orderObj[aux] = v;

                    aux++;
                }
            });

            return orderObj;
        }
    }
});

_tess.directive("stepper", function() {
    return {
        transclude: true,
        restrict: "A",

        link: function($scope, element, attrs) {
            $(element).stepper();
        }
    };
});

_tess.directive("soltarArchivos", function() {
     return {
          transclude: true,
          restrict: "AE",

          link: function($scope, element, attrs) {
               var esValida;
               var procesarDD;
               var extesionesValidas = attrs.soltarArchivos;
               
               procesarDD = function(e) {
                    e.preventDefault();
                    e.originalEvent.dataTransfer.effectAllowed = "copy";

                    return false;
               };

               esValida = function(extesiones) {
                    if(extesionesValidas.indexOf(extesiones) > -1) {
                         return true;
                    } else {
                         alert("Tipo de archivo incorrecto son solo válidos los siguientes:" + extesionesValidas);
                         
                         return false;
                    }
               };

               element.on("dragover", procesarDD);
               // element.on("dragenter", procesarDD);

               return element.bind("drop", function(e) {
                    // console.log("DROP", e.dataTransfer.files[0]);
                    var archivo;
                    var nombre;
                    var lector;
                    var tamano;
                    var tipo;
                    var info;
                    
                    e.preventDefault();

                    lector = new FileReader();
                    lector.onload = function(evt) {
                         if(esValida(tipo)) {
                              $scope.$apply(function() {
                                   $scope.altaproducto.archivo = evt.target.result;
                              });
                              // $scope.$apply(function() {
                              //      // $scope.altaproducto.archivo = evt.target.result;
                              //      // scope.archivo = evt.target.result;
                              //      // TMPlistado[0] = (evt.target.result);
                              //      // scope.listado = TMPlistado;
                              //      // // enviarImg.pasar(scope.archivo, nombre);
                              // });
                         }
                    };

                    archivo = e.originalEvent.dataTransfer.files[0];
                    nombre = archivo.name;
                    tipo = archivo.type;
                    tamano = archivo.size;
                    lector.readAsDataURL(archivo);
               });
          }
     };
});