'use strict';

// Consumos controller
angular.module('consumos').controller('ConsumosController', ['$scope', '$stateParams', '$location', 'Authentication', 'Consumos', 'Personas', 'Productos', 'Persona', 'Consumo',
	function($scope, $stateParams, $location, Authentication, Consumos, Personas, Productos, Persona, Consumo) {
		$scope.authentication = Authentication;

        $scope.consumo = {};
        $scope.consumo.productos = [];

        $scope.newPersona = function() {
            Consumo.setNewConsumo($scope.consumo);
            $location.path('personas/create');
        }
        $scope.initNewConsumo = function() {

            $scope.consumo.persona = null;
            var consumo = Consumo.getNewConsumo();
            if (consumo !== null) {
                $scope.consumo = consumo;
            }
            $scope.newPersonaState = false;
            $scope.newArticulo = {};
            $scope.newArticulo.producto = null;

            $scope.personas = Personas.query(function(personas){
                $scope.personas = personas;
                var newPersona = Persona.getNewPersona();
                if(newPersona !== null) {
                  //  $scope.persona.selected = newPersona;
                    $scope.consumo.persona = newPersona;
                }
            });

            Productos.query(function(productos){

                var filteredProductos = [];
                angular.forEach(productos, function(producto){

                    if (producto.stockActual > 0) {
                        filteredProductos.push(producto);
                    }
                });
                $scope.productos = filteredProductos;

            });

            $scope.$watch('newArticulo', function(value){

                $scope.isValidNewArticulo = false;
                if (!angular.isDefined(value.producto)) {
                    $scope.error = 'Seleccioná un producto en el Nuevo artículo.';
                }else if (!angular.isDefined(value.cantidad) || !value.cantidad > 0) {
                    $scope.error = 'Ingrese la cantidad de articulos.';
                }else if(value.cantidad > value.producto.stockActual) {
                    $scope.error = 'La cantidad no puede ser mayor al stock actual del producto';
                }else{
                    $scope.isValidNewArticulo = true;
                }

            }, true);

        };
        $scope.$watch('consumo', function(value){

            $scope.enableSaveConsumo = false;
            if (value.fecha && value.persona && value.productos.length > 0) {
                $scope.enableSaveConsumo = true;
            }
        }, true);


        $scope.saveNewArticulo = function() {
            if ($scope.isValidNewArticulo) {
                $scope.consumo.productos.push($scope.newArticulo);
                $scope.newArticulo = {};
            }
        };

        $scope.deleteProducto = function(index) {
            $scope.consumo.productos.splice(index, 1);
        };
        $scope.getToList = function(){
            Persona.setNewPersona(null);
            $location.path('consumos');
        };

		// Create new Consumo
		$scope.createConsumo = function() {
			// Create new Consumo object
            var consumo = $scope.consumo;
            consumo.persona = $scope.consumo.persona._id;
            consumo.monto = 0;
            angular.forEach(consumo.productos, function(producto){
                consumo.monto +=  producto.producto.precio * producto.cantidad;
            });
			var consumo = new Consumos (consumo);

			// Redirect after save
			consumo.$save(function(response) {
                Consumo.setNewConsumo(null);
				$location.path('consumos/' + response._id);

				// Clear form fields
                $scope.consumo = {};
                $scope.consumo.productos = [];
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

        $scope.predicate = 'fecha'
	}
]);
