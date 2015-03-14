_tess.controller("producto", function($rootScope, $scope, $http, $routeParams, carritoCompras) {
    $scope.cantidadProducto = 3;
    $scope.productoAcomprar = {};
    $scope.coloresEscojer = [];
    $scope.temp = {};

    $http({
        method: "GET",
        url: "/productos/obtener", 
        params: {_id: $routeParams._id}
    })
    .success(function(response) {
        $scope.productoAcomprar = response[0];
    });

    $scope.cantidadProductos = function(){
        return new Array($scope.cantidadProducto);
    };

    $scope.anadirProductoCarrito = function(addProducto, referencia) {
        $scope.addProducto = {};
        $scope.addProducto[referencia] = addProducto;

        carritoCompras.update($scope.IDFBUsuario, $scope.addProducto);
    }
});