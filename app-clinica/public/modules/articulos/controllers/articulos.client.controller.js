'use strict';

// Articulos controller
angular.module('articulos').controller('ArticulosController', ['$scope', '$stateParams', '$location', 'Authentication', 'Articulos',
	function($scope, $stateParams, $location, Authentication, Articulos) {
		$scope.authentication = Authentication;

		// Create new Articulo
		$scope.create = function() {
			// Create new Articulo object
			var articulo = new Articulos ({
				name: this.name
			});

			// Redirect after save
			articulo.$save(function(response) {
				$location.path('articulos/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Articulo
		$scope.remove = function(articulo) {
			if ( articulo ) { 
				articulo.$remove();

				for (var i in $scope.articulos) {
					if ($scope.articulos [i] === articulo) {
						$scope.articulos.splice(i, 1);
					}
				}
			} else {
				$scope.articulo.$remove(function() {
					$location.path('articulos');
				});
			}
		};

		// Update existing Articulo
		$scope.update = function() {
			var articulo = $scope.articulo;

			articulo.$update(function() {
				$location.path('articulos/' + articulo._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Articulos
		$scope.find = function() {
			$scope.articulos = Articulos.query();
		};

		// Find existing Articulo
		$scope.findOne = function() {
			$scope.articulo = Articulos.get({ 
				articuloId: $stateParams.articuloId
			});
		};
	}
]);