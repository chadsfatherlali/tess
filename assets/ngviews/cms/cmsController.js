// _tess.components.controller("cms", function($rootScope, $scope, $routeParams, $location, $window, $http) {
_tess.controller("cms", function($rootScope, $scope, $routeParams, $location, $window, $http) {
    $scope.oneAtATime = true;
    $scope.altaproducto = {};
    $scope.altaproducto.stockaje = {};
    $scope.productos = {};

    $http.get("/especificaciones/obtener/Categoria").success(function(response) {
        $scope.categorias = response;
    });

    $http.get("/especificaciones/obtener/TipoProducto").success(function(response) {
        $scope.tiposproductos = response;
    });

    $http.get("/especificaciones/obtener/NuevoColor").success(function(response) {
        $scope.nuevocolors = response;
    });

    $http.get("/especificaciones/obtener/NuevaTalla").success(function(response) {
        $scope.nuevatallas = response;
    });

    $scope.borrarEspicificacion = function(modelo, obj, $event) {
        var array = modelo.toLowerCase() + "s";
        
        $http({
            method: "GET",
            url: "/especificaciones/borrar/" + modelo,
            params: obj
        })
        .success(function(response) {
            if(response) {
                angular.forEach($scope[array], function(value, key) {
                    if(JSON.stringify(value) === JSON.stringify(obj)) {
                        delete $scope[array][key];
                        
                        angular.element($event.target).parent().parent()[0].remove();
                    }
                });
            }

            else {
                alert("Se produjo un error");
            }
        });
    };

    $scope.submitform = function(obj) {
        $http.post("/especificaciones", obj)
        .success(function(response) {
            if(response.success) {
                alert(response.reason);

                window.location.reload();
            }

            else {
                alert(response.reason);
            }
        });
    };

    $scope.limipiarForm = function(obj) {
        $scope.altaproducto = {};
        $scope.altaproducto.stockaje = {};
        $scope.altaproducto.tipo = "AltaProducto";
    };

    $scope.llenarMedida = function(value1, value2) {
        var vector = $scope.altaproducto.stockaje[value1];

        if(vector) {
            angular.forEach($scope.altaproducto.stockaje, function(value, key) {
                if(value1 === key) {
                    delete $scope.altaproducto.stockaje[key];

                    return false;
                }
            });
        }

        else {
            $scope.altaproducto.stockaje[value1] = {
                medida: value2,
                colores: [],
                cantidad: null
            };
        }
    };

    $scope.llenarColores = function(array, value1, value2) {
        var vector = $scope.altaproducto.stockaje[array].colores;
        var existe = false;
        var index = 0;

        if(vector.length > 0) {
            angular.forEach(vector, function(value, key) {
                if(value.color === value1 && value.nombre === value2) {
                    existe = true;
                    index = key;
                }
            });
        }

        if(existe) {
            vector.splice(index, 1);
        }

        else {
            var obj = {
                color: value1,
                nombre: value2
            };

            vector.push(obj);			
        }
    };

    $scope.llenarCantidad = function(array, value) {
        $scope.altaproducto.stockaje[$scope.ActualIdStockaje].cantidad = value;
    };

    $scope.obtenerProductos = function(offset, categoria, tipoproducto) {
        var obj = {
            offset: offset || 0,
            categoria: categoria || null,
            tipoproducto: tipoproducto || null
        };

        $http({
            method: "GET",
            url: "/productos/obtener", 
            params: obj
        })
        .success(function(response) {
            $scope.productos = response;
        });
    };

    $scope.editarProductos = function(obj) {
        $scope.altaproducto = obj;
    };

    $scope.borrarProductos = function(obj, $event) {
        $http({
            method: "GET",
            url: "/productos/borrar", 
            params: obj
        })
        .success(function(response) {
            if(response) {
                angular.forEach($scope.productos, function(value, key) {
                    if(JSON.stringify(value) === JSON.stringify(obj)) {
                        delete $scope.productos[key];

                        angular.element($event.target).parent().parent()[0].remove();
                    }
                });
            }

            else {
                alert("Se produjo un error");
            }
        });
    };

    $scope.status = {
        isFirstOpen: true,
        isFirstDisabled: false
    };
});