'use strict';

// Proveedores controller
angular.module('proveedores').controller('ProveedoresController', ['$scope', '$stateParams', '$location', 'Authentication', 'Proveedores',
	function($scope, $stateParams, $location, Authentication, Proveedores) {
		$scope.authentication = Authentication;

		// Create new Proveedore
        $scope.proveedor = {};

		$scope.create = function() {
			// Create new Proveedore object

			var proveedore = new Proveedores ($scope.proveedor);

			// Redirect after save
			proveedore.$save(function(response) {
                $location.path('compras/create');

				// Clear form fields
              //  $scope.proveedor = {};
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

        $scope.cancel = function() {
            $location.path('compras/create');
        }
		// Remove existing Proveedore
		$scope.remove = function(proveedore) {
			if ( proveedore ) { 
				proveedore.$remove();

				for (var i in $scope.proveedores) {
					if ($scope.proveedores [i] === proveedore) {
						$scope.proveedores.splice(i, 1);
					}
				}
			} else {
				$scope.proveedor.$remove(function() {
					$location.path('proveedores');
				});
			}
		};

		// Update existing Proveedore
		$scope.update = function() {
			var proveedore = $scope.proveedor;

			proveedore.$update(function() {
				$location.path('proveedores/' + proveedore._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Proveedores
		$scope.find = function() {
			$scope.proveedores = Proveedores.query();
		};

		// Find existing Proveedore
		$scope.findOne = function() {
			$scope.proveedor = Proveedores.get({
				proveedoreId: $stateParams.proveedoreId
			});
		};
	}
]);