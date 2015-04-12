_tess.controller("producto", function($rootScope, $scope, $http, $routeParams, carritoCompras, $compile, objReorder, $location) {
    var html = "<div id=\"[['compra' | generateid ]]\" compra></div>";

    $scope.productoAcomprar = {};
    $scope.coloresEscojer = [];
    $scope.listado = [];
    $scope.obj = {};
    $scope.temp = {};
    $scope.cantidadProductos = new Array(1);

    angular.element(document.querySelector("#carritoCompra")).append($compile(html)($scope));

    $http({
        method: "GET",
        url: "/productos/obtener", 
        params: {_id: $routeParams._id}
    }).
        success(function(response) {
            $scope.productoAcomprar = response[0];

            var obj =  carritoCompras.get($rootScope.IDFBUsuario);
            var referencia = $scope.productoAcomprar['referencia'];
            var compras = objReorder.do(obj.compras[referencia]);
            var comprasLength = Object.keys(compras).length;

            if (comprasLength > 0) {
                $scope.cantidadProductos = new Array(comprasLength - 2);
                $scope.temp = compras;
            }
        });

    $scope.cantidadProducto = function(accion, index, elemento) {
        switch(accion) {
            case "add":
                $scope.cantidadProductos.push({});

                angular.element(document.querySelector("#carritoCompra")).append($compile(html)($scope));
                break;

            case "del":
                if($scope.temp[index]) $scope.restarPrecio(index);

                var del = angular.element(elemento.currentTarget);

                del.parent().remove();

                delete $scope.temp[index];
                break;
        }

        $scope.temp._id = $scope.productoAcomprar._id;
        $scope.temp.archivo = $scope.productoAcomprar.archivo;

        $scope.actualizarCarrito($scope.temp, $scope.productoAcomprar.referencia);
    };

    $scope.actualizarCarrito = function(addProducto, referencia, relocate) {
        addProducto._id = $scope.productoAcomprar._id;
        addProducto.archivo = $scope.productoAcomprar.archivo;

        carritoCompras.update($scope.IDFBUsuario, addProducto, referencia);

        if(relocate) $location.url("/index");
    }

    $scope.listado = function(elementos) {
        $scope.listado = elementos.split(",");
    };

    $scope.sumarPrecios = function(obj, index, precio, cantidad) {
        $scope.temp.precioTotal = 0;

        obj[index].precio = precio * cantidad;


        angular.forEach(obj, function(v, k) {
            $scope.temp.precioTotal = $scope.temp.precioTotal + ~~v.precio;
        });
    };

    $scope.restarPrecio = function(index) {
        $scope.temp.precioTotal = $scope.temp.precioTotal - ~~$scope.temp[index].precio;
    }
});