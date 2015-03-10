'use strict';

// Pagos controller
angular.module('pagos').controller('PagosController', ['$scope', '$stateParams', '$location', '$filter', 'Authentication', 'Pagos', 'Personas', 'Consumos',
	function($scope, $stateParams, $location, $filter, Authentication, Pagos, Personas, Consumos) {
		$scope.authentication = Authentication;

        $scope.personas = Personas.query();
        $scope.consumos = Consumos.query();

        $scope.pago = {moneda:'UYU'};
        $scope.pago.fecha = $filter("date")(Date.now(), 'yyyy-MM-dd');

        $scope.changeMoneda = function () {
            if ($scope.pago.moneda == 'UYU') {
                $scope.pago.moneda = 'USD';
            }else{
                $scope.pago.moneda = 'UYU';
            }
        };

		// Create new Pago
		$scope.createPago = function() {
			// Create new Pago object
			var pago = new Pagos($scope.pago);

			// Redirect after save
			pago.$save(function(response) {
				$location.path('pagos');

				// Clear form fields
				$scope.pago = {};
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