'use strict';

// Productos controller
angular.module('productos').controller('ProductosController', ['$scope', '$stateParams', '$location', 'Authentication', 'Productos', 'Tipoproductos', 'Fabricantes', 'Producto',
	function($scope, $stateParams, $location, Authentication, Productos, Tipoproductos, Fabricantes, Producto) {
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
        //tipo de producto
        $scope.tipoproducto = {};
        $scope.tipoProductos = Tipoproductos.query(function(response){
            $scope.tipoProductos = response;
        });
        $scope.tipoProductos = [];
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
        $scope.fabricantes = Fabricantes.query(function(response){
             $scope.fabricantes = response;
        });

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

        $scope.createProductoFromArticulo = function() {

            // Create new Producto object

            $scope.producto.tipoProducto = $scope.tipoproducto.selected._id;
            $scope.producto.fabricante = $scope.fabricante.selected._id;
            var producto = new Productos ($scope.producto);

            // Redirect after save
            producto.$save(function(response) {
                Producto.setNewProducto(response);
                $scope.$parent.comprasFromProductoState();
                //$location.path('productos/' + response._id);

                // Clear form fields
                $scope.producto = {};
                $scope.tipoproducto.selected = null;
                $scope.fabricante.selected = null;
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

		// Remove existing Producto
		$scope.remove = function(producto) {
			if ( producto ) { 
				producto.$remove();

				for (var i in $scope.productos) {
					if ($scope.productos [i] === producto) {
						$scope.productos.splice(i, 1);
					}
				}
			} else {
				$scope.producto.$remove(function() {
					$location.path('productos');
				});
			}
		};

		// Update existing Producto
		$scope.update = function() {
            if ($scope.newProductTypeStateBoolean) {

                $scope.createTipoProducto();
            }else if( $scope.newFabricanteStateBoolean){
                $scope.newFabricante();
            } else {
                var producto = $scope.producto;
                $scope.producto.tipoProducto = $scope.tipoproducto.selected._id;
                $scope.producto.fabricante = $scope.fabricante.selected._id;
                producto.$update(function() {
                    $location.path('productos/' + producto._id);
                }, function(errorResponse) {
                    $scope.error = errorResponse.data.message;
                });
            }
		};

		// Find a list of Productos
		$scope.find = function() {
			$scope.productos = Productos.query();
		};

		// Find existing Producto
		$scope.findOne = function() {

			$scope.producto = Productos.get({ 
				productoId: $stateParams.productoId
			}, function(){
                $scope.fabricante.selected = $scope.producto.fabricante;
                $scope.tipoproducto.selected = $scope.producto.tipoProducto;
            });

		};

        $scope.producto.fraccionable = false;

        $scope.changeFraccionable = function () {
            $scope.producto.fraccionable = !$scope.producto.fraccionable;
        };

        $scope.producto.consumible = false;

        $scope.changeConsumible = function () {
            $scope.producto.consumible = !$scope.producto.consumible;
        };

        $scope.producto.activo = true;

        $scope.changeActivo = function () {
            $scope.producto.activo = !$scope.producto.activo;
        };
	}
]);