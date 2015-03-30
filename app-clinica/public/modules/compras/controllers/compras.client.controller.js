'use strict';

// Compras controller
angular.module('compras').controller('ComprasController', ['$scope', '$stateParams', '$location', 'Authentication', 'Compras', 'Articulos', 'Productos', 'Proveedores','$q', 'Producto', 'Proveedor', '$filter',
    function($scope, $stateParams, $location, Authentication, Compras, Articulos, Productos, Proveedores, $q, Producto, Proveedor, $filter) {
        $scope.authentication = Authentication;

        //proveedores

        $scope.showDeleteMessage = false;

        $scope.proveedores = Proveedores.query(function(proveedores) {
            $scope.proveedores = proveedores;
        });
        // Nueva Compra
        $scope.compra = {};
        $scope.compra.fecha = $filter("date")(Date.now(), 'yyyy-MM-dd');
        $scope.compra.articulos = [];
        $scope.compra.proveedor = {};
        $scope.proveedor = {};
        $scope.compra.pago = false;
        $scope.proveedor.selected = '';
        $scope.changePago = function () {
            $scope.compra.pago = !$scope.compra.pago;
        };

        function saveArticulo(art) {

            var d = $q.defer();
            art.producto = art.producto._id;
            var articulo = new Articulos(art);
            var result = {};
            if (!art._id) {
                result = articulo.$save();
                d.resolve(result);
            } else {
                result =  articulo.$update();
                d.resolve(result);
            }

            return d.promise;
        };
        $scope.newProveedorState = function() {
            $location.path('proveedores/create');
        }

        $scope.createCompraInit = function() {
            $scope.proveedores = Proveedores.query(function(proveedores) {
                $scope.proveedores = proveedores;
                $scope.proveedor.selected = Proveedor.getNewProveedor();

            });
            $scope.productos = Productos.query(function(productos){
                $scope.productos = productos;
            });
            if(Producto.getFlagFromCompra()) {
                Producto.setFlagFromCompra(false);
                $scope.compra = Producto.getCompra();
                $scope.proveedor.selected = Producto.getProveedorFromCompra();
                $scope.newArticulo.producto = Producto.getNewProducto();
            }
        };
        $scope.createCompra = function() {
            // Create new Compra object

            //Articulos
            var articulosIds = [];
            var promises = [];
            angular.forEach($scope.compra.articulos, function(art){


                promises.push(saveArticulo(art));
            });
            $q.all(promises).then(function(response){

                articulosIds = [];
                var monto = 0;
                angular.forEach(response, function(articulo){
                    monto += articulo.cantidad * articulo.precio;
                    articulosIds.push(articulo._id);

                    Productos.get({
                        productoId: articulo.producto
                    }, function(prod, err) {

                        prod.precio = articulo.precio;
                        prod.moneda = articulo.moneda;
                        prod.frecuencia = prod.frecuencia + 1;
                        prod.$update();
                    });
                });
                $scope.compra.monto = monto;
                $scope.compra.articulos = articulosIds;

                $scope.isValidNewArticulo = false;
                $scope.compra.proveedor = $scope.proveedor.selected._id;

                var compra = new Compras ($scope.compra);

                // Redirect after save
                compra.$save(function(response) {
                    $location.path('compras');

                    // Clear form fields
                    $scope.compra = {};
                }, function(errorResponse) {
                    $scope.error = errorResponse.data.message;
                });
            })
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

        $scope.newProducto = function(){

            Producto.setCompra($scope.compra);
            Producto.setFlagFromCompra(true);
            Producto.setProveedorFromCompra($scope.proveedor.selected);
            $location.path('productos/create');
            //$scope.newProductoState = true;
        };

        // Update existing Compra
        var compraOldValues = {};
        $scope.editCompraInit = function() {
            $scope.proveedores = Proveedores.query(function(proveedores) {
                $scope.proveedores = proveedores;

            });
            $scope.productos = Productos.query(function(productos){
                $scope.productos = productos;
            });
            $scope.findOne();

        };
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
            $scope.compras = Compras.query(function(result){
                $scope.compras = result;
            });
        };

        // Find existing Compra
        $scope.findOne = function() {

            $scope.compra = Compras.get({
                compraId: $stateParams.compraId
            }, function(compra){
                $scope.compra = compra;
                compraOldValues = angular.copy(compra);
            });
        };
        //Articulos
        $scope.newArticulo = {'moneda':'UYU'};

        $scope.changeMonedaCompra = function () {
            if ($scope.newArticulo.producto) {
                if ($scope.newArticulo.moneda == 'UYU') {
                    $scope.newArticulo.moneda = 'USD';
                } else {
                    $scope.newArticulo.moneda = 'UYU';
                }
            }
        };

        $scope.saveNewArticulo = function() {
            if ($scope.isValidNewArticulo) {
                $scope.compra.articulos.push($scope.newArticulo);
                $scope.newArticulo = {'moneda':'UYU'};
            }
        };
        $scope.deleteArticulo = function(index){
            $scope.compra.articulos.splice(index, 1);
        };
        $scope.$watch('newArticulo', function(value){

            $scope.isValidNewArticulo = false;
            if (!angular.isDefined(value.producto)) {
                $scope.error = 'Seleccioná un producto en el Nuevo artículo.';
            }else if (!angular.isDefined(value.cantidad)) {
                $scope.error = 'Ingrese la cantidad de articulos.';
            }else if (!angular.isDefined(value.precio)) {
                $scope.error = 'Ingrese el precio.';
            } else{
                $scope.isValidNewArticulo = true;
            }

        }, true);

        $scope.showError = function(){
            console.log('showError');
        };
        $scope.enableSave = false;
        $scope.$watch('compra', function(){

            var enableToSave = true;
            if (!$scope.compra.factura) {
                enableToSave = false;
            }
            if (!$scope.proveedor.selected || !$scope.proveedor.selected._id) {
                enableToSave = false;
            }
            if (!angular.isDefined($scope.compra.articulos) || $scope.compra.articulos.length === 0) {
                enableToSave = false;
            }

            $scope.enableSave = enableToSave;
        }, true);

        $scope.$watch('proveedor.selected', function(){

            var enableToSave = true;
            if (!$scope.compra.factura) {
                enableToSave = false;
            }
            if (!$scope.proveedor.selected || !$scope.proveedor.selected._id) {
                enableToSave = false;
            }
            if (!angular.isDefined($scope.compra.articulos) || $scope.compra.articulos.length === 0) {
                enableToSave = false;
            }

            $scope.enableSave = enableToSave;
        }, true);

        $scope.predicate = 'fecha';
        $scope.reverse = true;
        
    }
])
    .directive('switch', ['$timeout', function ($timeout){
        return {
            restrict: 'A',
            scope: {
                attrChecked: '='
            },
            link: function (scope, element, attr) {
                $timeout(function() {
                    $(element).wrap('<div class="switch" />').parent().bootstrapSwitch({checked: scope.attrChecked});
                });
            }
        }
    }]);
