//_tess.components.controller("index", function($rootScope, $scope, $routeParams, $location, $window, $http) {
_tess.controller("index", function($rootScope, $scope, $routeParams, $location, $window, $http, ngProgress, carritoCompras) {
    $scope.busquedatextoresponse = [];
    $scope.FBID = "661292413991564";
    $scope.IDFBUsuario;
    $scope.busqueda = "";
    $scope.carrito = [];
    $scope.mostrar = [];
    $scope.addProducto = {};

    var coloresngprogress = ["#eb9316", "#265a88", "#5cb85c", "#ec971f", "#31b0d5"];
    
    ngProgress.height("2px");
    
    $scope.$on("starthttprequest", function() {
        ngProgress.color(coloresngprogress[Math.floor((Math.random() * coloresngprogress.length) + 0)]);
        ngProgress.start();
    });

    $scope.$on("completehttprequest", function() {
        ngProgress.complete();
    });


    (function(d, s, id){
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) {return;}
        js = d.createElement(s); js.id = id;
        js.src = "//connect.facebook.net/es_ES/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
    }(document, "script", "facebook-jssdk"));

    $window.fbAsyncInit = function() {
        $rootScope.FB = FB;

        $rootScope.FB.init({
            appId: $scope.FBID,
            xfbml: true,
            version: "v2.1"
        });

        $rootScope.FB.getLoginStatus(function(response) {
            if(response.status === "connected") {
                $scope.respuestaFB(response);
            } 

            else if(response.status === "not_authorized") {
                $scope.logarFB();
            } 

            else {
                $scope.logarFB();
            }
        });

        $scope.logarFB = function() {
            $rootScope.FB.login(function(response) {
                if(response.authResponse) {
                    $scope.respuestaFB(response);
                }

                else {
                    console.log("SE HA PRODUCIDO UN ERROR EM LA CONEXION FB");
                }
            }, 

            {
                scope: "email,user_likes"
            });
        };

        $scope.respuestaFB = function(response) {
            $rootScope.FB.api("/me?fields=picture", function(response) {
                $scope.IDFBUsuario = response.id;

                carritoCompras.crear($scope.IDFBUsuario);

                $scope.ifLike();
            });
        };

        $scope.ifLike = function() {
            $rootScope.FB.api("/me/likes/590562517739494", function(response) {
                console.log("LIKES:", response);
            });
        };
    };
    
    $scope.$watch("busqueda", function() {
        if($scope.busqueda.length > 1) {
            $http.get("/busquedatexto/" + $scope.busqueda).success(function(response) {
                $scope.busquedatextoresponse = response.array;
            });
        }
    });
    
    $scope.status = {
        isopen: false
    };
    
    $scope.toggleDropdown = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        
        $scope.status.isopen = !$scope.status.isopen;
    };
    
    /*$scope.Acomprar = function(obj) {
        $scope.$broadcast("Acomprar", obj);
    };*/
});