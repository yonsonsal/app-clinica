'use strict';

// Articulos controller
angular.module('articulos').controller('ArticulosController', ['$scope', '$stateParams', '$location', 'Authentication', 'Articulos',
	function($scope, $stateParams, $location, Authentication, Articulos) {
		$scope.authentication = Authentication;

        $scope.formTitle =  'Nuevo Producto';

        $scope.newTypeProductState = function(){
            $scope.formTitle =  'Nuevo Tipo de Producto';
            $scope.newProductTypeStateBoolean = true;
            $scope.newFabricanteStateBoolean = false;
        };
        $scope.newFabricanteState = function() {
            $scope.formTitle = 'Nuevo Fabricante';
            $scope.newFabricanteStateBoolean = true;
            $scope.newProductTypeStateBoolean = false;
        };
        $scope.newProductState = function() {
            $scope.formTitle = 'Nuevo Producto';
            $scope.newProductTypeStateBoolean = false;
            $scope.newFabricanteStateBoolean = false;
        };
        $scope.newArticuloState = function() {
            $scope.formTitle = 'Nuevo Artículo';
            $scope.newProductTypeStateBoolean = false;
            $scope.newFabricanteStateBoolean = false;
        }
        //tipo de producto
        $scope.tipoproducto = {};
        $scope.tipoProductos = Tipoproductos.query();
        $scope.newFabricanteStateBoolean = false;
        $scope.createTipoProducto = function(){

            // Create new Tipoproducto object
            var tipoproducto = new Tipoproductos ($scope.tipoproducto);
            tipoproducto.$save(function(response) {

                $scope.tipoproducto.selected = response;
                // Clear form fields
                $scope.newProductTypeStateBoolean = false;
                $scope.tipoProductos.push(response);
                $scope.newProductState();
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        //fabricante
        $scope.fabricante = {};
        $scope.fabricantes = Fabricantes.query();

        $scope.newFabricante = function() {

            var fabricante = new Fabricantes($scope.fabricante);
            fabricante.$save(function(response) {
                $scope.fabricante.selected = response;
                $scope.newFabricanteStateBoolean = false;
                $scope.fabricantes.push(response);
                $scope.newProductState();
            }, function (errorResponse){
                $scope.error = errorResponse.data.message;
            });
        };

        $scope.cancel = function() {
            $scope.newProductState();
        };
        $scope.create = function(){

            if ($scope.newProductTypeStateBoolean) {

                $scope.createTipoProducto();
            }else if( $scope.newFabricanteStateBoolean){
                $scope.newFabricante();
            } else {
                $scope.createProducto();
            }
        };
        // Create new Producto
        $scope.producto = {};
        $scope.createProducto = function() {

            // Create new Producto object
            $scope.producto.tipoProducto = $scope.tipoproducto.selected._id;
            $scope.producto.fabricante = $scope.fabricante.selected._id;
            var producto = new Productos ($scope.producto);

            // Redirect after save
            producto.$save(function(response) {
                $location.path('productos/' + response._id);

                // Clear form fields
                $scope.producto = {};
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

		// Create new Articulo
        $scope.articulo = {};
		$scope.create = function() {
			// Create new Articulo object
			var articulo = new Articulos ( $scope.articulo);

			// Redirect after save
			articulo.$save(function(response) {
				$location.path('articulos/' + response._id);

				// Clear form fields
                $scope.articulo = {};
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