'use strict';

// Consumos controller
angular.module('consumos').controller('ConsumosController',
    ['$scope', '$stateParams', '$location', 'Authentication', 'Consumos', 'Servicios', 'Personas', 'Productos', 'Persona', 'Consumo','$filter', '$window',
	function($scope, $stateParams, $location, Authentication, Consumos, Servicios, Personas, Productos, Persona, Consumo, $filter, $window) {

        $scope.authentication = Authentication;
        $scope.consumo = {};
        $scope.consumo.productos = [];

        $scope.tipoConsumo = false;
        $scope.changeTipo = function () {
            $scope.tipoConsumo = !$scope.tipoConsumo;
            $scope.newArticulo.producto = null;
        };

        $scope.consumo.pago = false;
        $scope.mustEnterCotizacion = false;
        $scope.consumo.cotizacion = Consumo.getLastCotizacion();
        $scope.changePagoConsumo = function () {

            $scope.consumo.fechaPago = $filter("date")(Date.now(), 'yyyy-MM-dd');
            $scope.viewPagoInterface = true;
            //$scope.consumo.cotizacion = Consumo.getLastCotizacion();
        };
        $scope.cancelPago = function() {
            $scope.viewPagoInterface = false;
        }
        $scope.pagoConsumo = function() {
            $scope.viewPagoInterface = false;
        }

        $scope.changeMoneda = function () {
            if ($scope.consumo.monedaPago == 'UYU') {
                $scope.consumo.monedaPago = 'USD';
            }else{
                $scope.consumo.monedaPago = 'UYU';
            }
        };
        $scope.$watch('consumo.cotizacion', function(cotizacion) {

            if (cotizacion > 0) {
                $scope.consumo.monto = $scope.consumo.montoDollar * cotizacion + $scope.consumo.montoPesos;
            }
        }, true);
        $scope.$watch('consumo.monedaPago', function(monedaPago) {

            if (monedaPago == 'UYU') {
                $scope.consumo.monto = $scope.consumo.montoDollar * $scope.consumo.cotizacion + $scope.consumo.montoPesos;
            } else {
                if ($scope.consumo.cotizacion > 0) {
                    $scope.consumo.monto = $scope.consumo.montoDollar + $scope.consumo.montoPesos / $scope.consumo.cotizacion;
                }
            }
        }, true);
        function roundNumber(number, precision){
            precision = Math.abs(parseInt(precision)) || 0;
            var multiplier = Math.pow(10, precision);
            return (Math.round(number * multiplier) / multiplier);
        }

        $scope.newPersona = function() {
            Consumo.setNewConsumo($scope.consumo);
            $location.path('personas/create');
        };
        $scope.initNewConsumo = function() {

            $scope.consumo.persona = null;

            var consumo = Consumo.getNewConsumo();
            if (consumo !== null) {
                $scope.consumo = consumo;
            }
            $scope.newPersonaState = false;
            $scope.newArticulo = {};
            $scope.newArticulo.producto = null;

            Personas.query(function(personas){
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

            Servicios.query(function(servicios){
                $scope.servicios = servicios;
            });

            function calcularValorLinea () {
                if ($scope.newArticulo != null && $scope.newArticulo.producto != null) {
                    $scope.newArticulo.precio = $scope.newArticulo.producto.precio * $scope.newArticulo.cantidad;

                    if ($scope.newArticulo.producto.factorSobreCosto > 0){
                        $scope.newArticulo.precio =  $scope.newArticulo.precio * $scope.newArticulo.producto.factorSobreCosto;
                    }

                    $scope.newArticulo.factor = $scope.newArticulo.producto.factorSobreCosto;
                    $scope.newArticulo.precio = roundNumber($scope.newArticulo.precio, 2);
                }
            }

            $scope.$watch('newArticulo.producto', function(value){
                calcularValorLinea();
            });

            $scope.$watch('newArticulo.producto.factorSobreCosto', function(value){
                calcularValorLinea();
            });

            $scope.$watch('newArticulo.cantidad', function(value){
                calcularValorLinea();
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

                angular.element( document.querySelector('#switch-articulo'))[0].focus();
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

        $scope.consumo.fecha = $filter("date")(Date.now(), 'yyyy-MM-dd');

		// Create new Consumo
		$scope.createConsumo = function() {
			// Create new Consumo object
      var consumo = $scope.consumo;
      consumo.persona = $scope.consumo.persona._id;
      consumo.montoPesos = 0;
      consumo.montoDollar = 0;
      Consumo.calculateMontos(consumo);
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

    $scope.updateCotizacion = function() {
      var consumo = $scope.consumo;
      consumo.$update(function() {
        $location.path('consumos/' + consumo._id);
      }, function(errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };
		// Update existing Consumo
		$scope.updateConsumo = function() {
			var consumo = $scope.consumo;
            $scope.consumo.pago = true;
            $scope.viewPagoInterface = false;
			consumo.$update(function() {
				$location.path('consumos/' + consumo._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

    $scope.updateConsumo2 = function() {
      var consumo = $scope.consumo;
      //$scope.consumo.pago = true;
      //$scope.viewPagoInterface = false;
      Consumo.calculateMontos(consumo);
      consumo.$update(function() {
        $location.path('consumos/' + consumo._id);
      }, function(errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

		// Find a list of Consumos
		$scope.find = function() {
			$scope.consumos = Consumos.query(function(consumos){
                var lastCotizacion = 0;
                var lastFecha = false;
                angular.forEach(consumos, function(consumo){
                    if (consumo.pago) {
                        if (!lastFecha) {
                            lastFecha = consumo.fechaPago;
                            lastCotizacion = consumo.cotizacion;
                        } else if (consumo.fechaPago > lastFecha){
                            lastFecha = consumo.fechaPago;
                            lastCotizacion = consumo.cotizacion;
                        }
                    }
                });
                Consumo.setLastCotizacion(lastCotizacion);
            });
		};

		// Find existing Consumo
		$scope.findOne = function() {
      //console.log('algo');
			Consumos.get({
				consumoId: $stateParams.consumoId
			}, function(consumo) {
                if (!consumo.pago  && !consumo.cotizacion) {
                    consumo.cotizacion = Consumo.getLastCotizacion();
                } else if(!consumo.cotizacion) {
                  consumo.cotizacion = 1;
                }
                $scope.consumo = consumo;
                $scope.consumo.fecha = $filter("date")(consumo.fecha, 'yyyy-MM-dd');
            });
		};

        $scope.predicate = 'fecha';
        $scope.searchConsumo = {persona:{'nombre':''}} ;

        $scope.print = function (){
            $window.print();
        }


    $scope.initEditConsumo = function() {

      $scope.consumo.persona = null;

      $scope.findOne();
      $scope.newPersonaState = false;
      $scope.newArticulo = {};
      $scope.newArticulo.producto = null;

      Personas.query(function(personas){
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

      Servicios.query(function(servicios){
        $scope.servicios = servicios;
      });

      function calcularValorLinea () {
        if ($scope.newArticulo != null && $scope.newArticulo.producto != null) {
          $scope.newArticulo.precio = $scope.newArticulo.producto.precio * $scope.newArticulo.cantidad;

          if ($scope.newArticulo.producto.factorSobreCosto > 0){
            $scope.newArticulo.precio =  $scope.newArticulo.precio * $scope.newArticulo.producto.factorSobreCosto;
          }

          $scope.newArticulo.factor = $scope.newArticulo.producto.factorSobreCosto;
          $scope.newArticulo.precio = roundNumber($scope.newArticulo.precio, 2);
        }
      }

      $scope.$watch('newArticulo.producto', function(value){
        calcularValorLinea();
      });

      $scope.$watch('newArticulo.producto.factorSobreCosto', function(value){
        calcularValorLinea();
      });

      $scope.$watch('newArticulo.cantidad', function(value){
        calcularValorLinea();
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

    }
	}
]);
