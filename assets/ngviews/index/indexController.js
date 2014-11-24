//_tess.components.controller("index", function($rootScope, $scope, $routeParams, $location, $window, $http) {
_tess.controller("index", function($rootScope, $scope, $routeParams, $location, $window, $http) {
	$scopeFBID = "661292413991564";

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
               appId: $scopeFBID,
               xfbml: true,
               version: "v2.1"
          });

          $rootScope.FB.getLoginStatus(function(response) {
               if (response.status === "connected") {
                    $scope.respuestaFB(response);
               } 
               
               else if (response.status === "not_authorized") {
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
               }, {
                    scope: "email,user_likes"
               });
          }

          $scope.respuestaFB = function(response) {
               $rootScope.FB.api("/me?fields=picture",
               function(response) {
                    console.log("FBUSER", response);

                    $scope.ifLike();
               });
          }

          $scope.ifLike = function() {
          	$rootScope.FB.api("/me/likes/590562517739494", function(response) {
          		console.log("LIKES:", response);
          	});
          }
     };
});