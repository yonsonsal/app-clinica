'use strict';

// Fabricantes controller
angular.module('fabricantes').controller('FabricantesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Fabricantes',
	function($scope, $stateParams, $location, Authentication, Fabricantes) {
		$scope.authentication = Authentication;

		// Create new Fabricante
        $scope.fabricante = {};
		$scope.create = function() {
			// Create new Fabricante object
			var fabricante = new Fabricantes ($scope.fabricante);

			// Redirect after save
			fabricante.$save(function(response) {
				$location.path('fabricantes/' + response._id);

				// Clear form fields
                $scope.fabricante = {};
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Fabricante
		$scope.remove = function(fabricante) {
			if ( fabricante ) { 
				fabricante.$remove();

				for (var i in $scope.fabricantes) {
					if ($scope.fabricantes [i] === fabricante) {
						$scope.fabricantes.splice(i, 1);
					}
				}
			} else {
				$scope.fabricante.$remove(function() {
					$location.path('fabricantes');
				});
			}
		};

		// Update existing Fabricante
		$scope.update = function() {
			var fabricante = $scope.fabricante;

			fabricante.$update(function() {
				$location.path('fabricantes/' + fabricante._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Fabricantes
		$scope.find = function() {
			$scope.fabricantes = Fabricantes.query();
		};

		// Find existing Fabricante
		$scope.findOne = function() {
			$scope.fabricante = Fabricantes.get({ 
				fabricanteId: $stateParams.fabricanteId
			});
		};
	}
]);