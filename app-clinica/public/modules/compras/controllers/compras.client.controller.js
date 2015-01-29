'use strict';

// Compras controller
angular.module('compras').controller('ComprasController', ['$scope', '$stateParams', '$location', 'Authentication', 'Compras', 'Articulos', 'Productos', 'Proveedores',
	function($scope, $stateParams, $location, Authentication, Compras, Articulos, Productos, Proveedores) {
		$scope.authentication = Authentication;

        //proveedores

        $scope.proveedores = Proveedores.query(function(proveedores) {
            $scope.proveedores = proveedores;
        });
		// Nueva Compra
        $scope.compra = {}
        $scope.compra.articulos = [];
		$scope.create = function() {
			// Create new Compra object

            //Articulos
            var articulosIds = [];
            angular.forEach($scope.articulos, function(art){

                var articulo = new Articulos(art);
                if(!art._id) {
                    articulo.$save(function (response) {

                        articulosIds.push(response._id);
                    });
                } else {
                    articulo.$update(function (response) {

                        articulosIds.push(response._id);
                    });
                }
            });
            $scope.compra.articulos = articulosIds;

			var compra = new Compras ($scope.compra);

			// Redirect after save
            compra.$save(function(response) {
				$location.path('compras/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

        // Articulos
        $scope.articulos = [];

		// Remove existing Compra
		$scope.remove = function(compra) {
			if ( compra ) { 
				compra.$remove();

				for (var i in $scope.compras) {
					if ($scope.compras [i] === compra) {
						$scope.compras.splice(i, 1);
					}
				}
			} else {
				$scope.compra.$remove(function() {
					$location.path('compras');
				});
			}
		};

        $scope.createProduct = function(){

            // Create new Producto object
            $scope.producto.tipoProducto = $scope.tipoproducto.selected._id;
            $scope.producto.fabricante = $scope.fabricante.selected._id;
            var producto = new Productos ($scope.producto);

            // Redirect after save
            producto.$save(function(response) {
                // Clear form fields
                $scope.producto = Productos.get({
                    productoId: response._id
                }, function(resp) {
                    $scope.productos.push(resp);
                    $scope.newArticulo.producto = response;
                    $scope.producto = {};
                    $scope.newProductoState = false;
                });

            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };
        //Productos
        $scope.newProductoState = false;
        $scope.newProducto = function(){
            $scope.newProductoState = true;
        };

        $scope.cancelProducto = function() {
            $scope.newProductoState = false;
        };

        $scope.productos = Productos.query(function(productos){
            $scope.productos = productos;
        });

        // Update existing Compra
		$scope.update = function() {
			var compra = $scope.compra;

			compra.$update(function() {
				$location.path('compras/' + compra._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Compras
		$scope.find = function() {
			$scope.compras = Compras.query();
		};

		// Find existing Compra
		$scope.findOne = function() {
			$scope.compra = Compras.get({ 
				compraId: $stateParams.compraId
			});
		};
        //Articulos
        $scope.newArticulo = {};
        $scope.saveNewArticulo = function() {
            $scope.compra.articulos.push($scope.newArticulo);
            $scope.newArticulo = {};
        }
        $scope.deleteArticulo = function(index){
            $scope.compra.articulos.splice(index, 1);
        }
	}
]);