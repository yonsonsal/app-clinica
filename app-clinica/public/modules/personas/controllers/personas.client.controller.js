'use strict';

// Personas controller
angular.module('personas').controller('PersonasController', ['$scope', '$stateParams', '$location', 'Authentication', 'Personas',
	function($scope, $stateParams, $location, Authentication, Personas) {
		$scope.authentication = Authentication;

		// Create new Persona
        $scope.persona = {};
		$scope.create = function() {
			// Create new Persona object
			var persona = new Personas ($scope.persona);

			// Redirect after save
			persona.$save(function(response) {
				$location.path('personas/' + response._id);

				// Clear form fields
                $scope.persona = {};
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
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
]);