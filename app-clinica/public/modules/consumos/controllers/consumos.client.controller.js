'use strict';

// Consumos controller
angular.module('consumos').controller('ConsumosController', ['$scope', '$stateParams', '$location', 'Authentication', 'Consumos',
	function($scope, $stateParams, $location, Authentication, Consumos) {
		$scope.authentication = Authentication;

		// Create new Consumo
		$scope.create = function() {
			// Create new Consumo object
			var consumo = new Consumos ({
				name: this.name
			});

			// Redirect after save
			consumo.$save(function(response) {
				$location.path('consumos/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Consumo
		$scope.remove = function(consumo) {
			if ( consumo ) { 
				consumo.$remove();

				for (var i in $scope.consumos) {
					if ($scope.consumos [i] === consumo) {
						$scope.consumos.splice(i, 1);
					}
				}
			} else {
				$scope.consumo.$remove(function() {
					$location.path('consumos');
				});
			}
		};

		// Update existing Consumo
		$scope.update = function() {
			var consumo = $scope.consumo;

			consumo.$update(function() {
				$location.path('consumos/' + consumo._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Consumos
		$scope.find = function() {
			$scope.consumos = Consumos.query();
		};

		// Find existing Consumo
		$scope.findOne = function() {
			$scope.consumo = Consumos.get({ 
				consumoId: $stateParams.consumoId
			});
		};
	}
]);