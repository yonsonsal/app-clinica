'use strict';

angular.module('core').controller('HeaderController', ['$scope', 'Authentication', 'Menus',
	function($scope, Authentication, Menus) {
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');

		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isCollapsed = true;
		});

	}
]).directive('ngSpace', function() {
    return function(scope, element, attrs) {
        element.bind("keydown keypress", function(event) {
            console.log(event);
            if(event.which === 32) {

                scope.$apply(function(){
                    scope.$eval(attrs.ngSpace, {'event': event});
                });
                element[0].focus();
                event.preventDefault();
            }
        });
    };
}).directive('ngEnter', function() {
    return function(scope, element, attrs) {
        element.bind("keydown keypress", function(event) {
            console.log(event);
            if(event.which === 13) {

                scope.$apply(function(){
                    scope.$eval(attrs.ngEnter, {'event': event});
                });

                event.preventDefault();
            }
        });
    };
});
