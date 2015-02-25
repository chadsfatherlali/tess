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

          // $routeProvider
          // .when("/:vista",
          //      {
          //           templateUrl: function($routeParams) {
          //                return "/assets/ngviews/" + $routeParams.vista + "/" + $routeParams.vista + ".html";
          //           },
          //           resolve: {
          //                load: ["$q", "$rootScope", "$route", function($q, $rootScope, $route) {
          //                     var deferred = $q.defer();
          //                     var nombreCtrl = $route.current.params.vista;
                              
          //                     require([
          //                          "/assets/ngviews/" + nombreCtrl + "/" + nombreCtrl + "Controller.js"
          //                     ], function() {
          //                          $rootScope.$apply(function () {
          //                               deferred.resolve();
          //                          });
          //                     });

          //                     return deferred.promise;
          //                }]
          //           }
          //      }
          // )
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

     // $scope.cmsView = function() {
     //      $location.path("/cms");
     // }

     // $scope.indexView = function() {
     //      $location.path("/index");
     // }
});

_tess.factory("httpInterceptor", function($rootScope) {
    //ngProgress.color("#5cb85c");
    
    return {
        // optional method
        'request': function(config) {
            // do something on success
            //ngProgress.start();
            $rootScope.$broadcast("starthttprequest");
            return config;
        },
        
        // optional method
       'requestError': function(rejection) {
            // do something on error
            if (canRecover(rejection)) {
              return responseOrNewPromise;
            }

            return $q.reject(rejection);
        },



        // optional method
        'response': function(response) {
            // do something on success
            //ngProgress.complete();
            
            $rootScope.$broadcast("completehttprequest");
            return response;
        },

        // optional method
       'responseError': function(rejection) {
            // do something on error
            if (canRecover(rejection)) {
                return responseOrNewPromise;
            }
            
           return $q.reject(rejection);
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