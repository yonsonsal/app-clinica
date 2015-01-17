'use strict';

// Tipoproductos controller
angular.module('tipoproductos').controller('TipoproductosController', ['$scope', '$stateParams', '$location', 'Authentication', 'Tipoproductos',
	function($scope, $stateParams, $location, Authentication, Tipoproductos) {
		$scope.authentication = Authentication;

        $scope.tipoproducto = {};
		// Create new Tipoproducto
		$scope.create = function() {
			// Create new Tipoproducto object
			var tipoproducto = new Tipoproductos ($scope.tipoproducto);

			// Redirect after save
			tipoproducto.$save(function(response) {
				$location.path('tipoproductos/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Tipoproducto
		$scope.remove = function(tipoproducto) {
			if ( tipoproducto ) { 
				tipoproducto.$remove();

				for (var i in $scope.tipoproductos) {
					if ($scope.tipoproductos [i] === tipoproducto) {
						$scope.tipoproductos.splice(i, 1);
					}
				}
			} else {
				$scope.tipoproducto.$remove(function() {
					$location.path('tipoproductos');
				});
			}
		};

		// Update existing Tipoproducto
		$scope.update = function() {
			var tipoproducto = $scope.tipoproducto;

			tipoproducto.$update(function() {
				$location.path('tipoproductos/' + tipoproducto._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Tipoproductos
		$scope.find = function() {
			$scope.tipoproductos = Tipoproductos.query();
		};

		// Find existing Tipoproducto
		$scope.findOne = function() {
			$scope.tipoproducto = Tipoproductos.get({ 
				tipoproductoId: $stateParams.tipoproductoId
			});
		};
	}
]);