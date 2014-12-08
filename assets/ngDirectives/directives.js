angular.module("_directives_", [])

.directive("owl", function() {
    return {
        restrict: "E",
        link: function(scope, element, attrs) {            
            $(element).owlCarousel({
                autoPlay: 3000,
                slideSpeed: 300,
                paginationSpeed: 400,
                singleItem: true
            });
        }
    };
});




