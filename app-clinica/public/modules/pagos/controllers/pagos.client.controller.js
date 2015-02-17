'use strict';

// Pagos controller
angular.module('pagos').controller('PagosController', ['$scope', '$stateParams', '$location', 'Authentication', 'Pagos',
	function($scope, $stateParams, $location, Authentication, Pagos) {
		$scope.authentication = Authentication;

		// Create new Pago
		$scope.create = function() {
			// Create new Pago object
			var pago = new Pagos ({
				name: this.name
			});

			// Redirect after save
			pago.$save(function(response) {
				$location.path('pagos/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Pago
		$scope.remove = function(pago) {
			if ( pago ) { 
				pago.$remove();

				for (var i in $scope.pagos) {
					if ($scope.pagos [i] === pago) {
						$scope.pagos.splice(i, 1);
					}
				}
			} else {
				$scope.pago.$remove(function() {
					$location.path('pagos');
				});
			}
		};

		// Update existing Pago
		$scope.update = function() {
			var pago = $scope.pago;

			pago.$update(function() {
				$location.path('pagos/' + pago._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Pagos
		$scope.find = function() {
			$scope.pagos = Pagos.query();
		};

		// Find existing Pago
		$scope.findOne = function() {
			$scope.pago = Pagos.get({ 
				pagoId: $stateParams.pagoId
			});
		};
	}
]);