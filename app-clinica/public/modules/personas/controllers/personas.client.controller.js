'use strict';

// Personas controller
angular.module('personas').controller('PersonasController', ['$scope', '$stateParams', '$location', 'Authentication', 'Personas', 'Persona',
	function($scope, $stateParams, $location, Authentication, Personas, Persona) {
		$scope.authentication = Authentication;

		// Create new Persona
        $scope.persona = {};
		$scope.create = function() {
			// Create new Persona object
			var persona = new Personas ($scope.persona);

			// Redirect after save
			persona.$save(function(response) {
                Persona.setNewPersona(response);
				$location.path('consumos/create');

				// Clear form fields
                $scope.persona = {};
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

        $scope.getToConsumos = function(){
            Persona.setNewPersona(null);
            $location.path('consumos/create');
        };

		// Remove existing Persona
		$scope.remove = function(persona) {
			if ( persona ) { 
				persona.$remove();

				for (var i in $scope.personas) {
					if ($scope.personas [i] === persona) {
						$scope.personas.splice(i, 1);
					}
				}
			} else {
				$scope.persona.$remove(function() {
					$location.path('personas');
				});
			}
		};

		// Update existing Persona
		$scope.update = function() {
			var persona = $scope.persona;

			persona.$update(function() {
				$location.path('personas/' + persona._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Personas
		$scope.find = function() {
			$scope.personas = Personas.query();
		};

		// Find existing Persona
		$scope.findOne = function() {
			$scope.persona = Personas.get({ 
				personaId: $stateParams.personaId
			});
		};
	}
]).directive("percent", function($filter){
    var p = function(viewValue){
        var m = viewValue.match(/^(\d+)\/(\d+)/);
        if (m != null)
            return $filter('number')(parseInt(m[1])/parseInt(m[2]), 2);
        return $filter('number')(parseFloat(viewValue)/100, 2);
    };

    var f = function(modelValue){
        return $filter('number')(parseFloat(modelValue)*100, 2);
    };

    return {
        require: 'ngModel',
        link: function(scope, ele, attr, ctrl){
            ctrl.$parsers.unshift(p);
            ctrl.$formatters.unshift(f);
        }
    };
});;
