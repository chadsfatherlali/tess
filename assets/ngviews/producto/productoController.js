_tess.controller("producto", function($rootScope, $scope, $http, $routeParams) {
    $scope.productoAcomprar = {};
    $scope.coloresEscojer = [];
    
    $http({
        method: "GET",
        url: "/productos/obtener", 
        params: {_id: $routeParams._id}
    })
    .success(function(response) {
        $scope.productoAcomprar = response[0];

        console.log("-->", $scope.productoAcomprar);
    });
});