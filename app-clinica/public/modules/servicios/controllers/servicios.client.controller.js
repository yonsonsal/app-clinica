'use strict';

// Servicios controller
angular.module('servicios').controller('ServiciosController', ['$scope', '$stateParams', '$location', 'Authentication', 'Servicios',
	function($scope, $stateParams, $location, Authentication, Servicios) {
		$scope.authentication = Authentication;

        $scope.servicio = {moneda:'UYU'};
		// Create new Servicio
		$scope.createServicio = function() {
			// Create new Servicio object
			var servicio = new Servicios ($scope.servicio);

			// Redirect after save
			servicio.$save(function(response) {
				//$location.path('consumos/create');
                $location.path('servicios');
				// Clear form fields
                $scope.servicio = {};
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

        $scope.$watch('servicio',function(value){

            $scope.enableSaveServicio = false;
            if (value.descripcion && value.precio && value.moneda) {
                $scope.enableSaveServicio = true;
            }
        }, true);
        $scope.cancelServicio = function() {
            $location.path('servicios');
        }
		// Remove existing Servicio
		$scope.remove = function(servicio) {
			if ( servicio ) { 
				servicio.$remove();

				for (var i in $scope.servicios) {
					if ($scope.servicios [i] === servicio) {
						$scope.servicios.splice(i, 1);
					}
				}
			} else {
				$scope.servicio.$remove(function() {
					$location.path('servicios');
				});
			}
		};

		// Update existing Servicio
		$scope.updateServicio = function() {
			var servicio = $scope.servicio;

			servicio.$update(function() {
				$location.path('servicios');
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Servicios
		$scope.find = function() {
			$scope.servicios = Servicios.query();
		};

		// Find existing Servicio
		$scope.findOne = function() {
			$scope.servicio = Servicios.get({ 
				servicioId: $stateParams.servicioId
			});
		};
	}
]);
