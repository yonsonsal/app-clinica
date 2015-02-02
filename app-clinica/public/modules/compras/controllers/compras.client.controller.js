'use strict';

// Compras controller
angular.module('compras').controller('ComprasController', ['$scope', '$stateParams', '$location', 'Authentication', 'Compras', 'Articulos', 'Productos', 'Proveedores','$q', 'Producto',
    function($scope, $stateParams, $location, Authentication, Compras, Articulos, Productos, Proveedores, $q, Producto) {
        $scope.authentication = Authentication;

        //proveedores

        $scope.proveedores = Proveedores.query(function(proveedores) {
            $scope.proveedores = proveedores;
        });
        // Nueva Compra
        $scope.compra = {};
        $scope.compra.articulos = [];
        $scope.compra.proveedor = {};
        $scope.proveedor = {};
        $scope.compra.pago = false;

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

        $scope.createCompraInit = function() {
            $scope.proveedores = Proveedores.query(function(proveedores) {
                $scope.proveedores = proveedores;

            });
            $scope.productos = Productos.query(function(productos){
                $scope.productos = productos;
            });
        }
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

        $scope.newProductoToSet = Producto.getNewProducto();
        $scope.createProduct = function(){

            // Create new Producto object
            $scope.newProducto;
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
        $scope.comprasState = function() {
            $scope.newProductoState = false;
        };
        $scope.comprasFromProductoState = function() {
            $scope.newProductoState = false;
            $scope.newArticulo.producto =  Producto.getNewProducto();
            $scope.productos.push(Producto.getNewProducto());

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
            $scope.compras = Compras.query(function(result){
                $scope.compras = result;
            });
        };

        // Find existing Compra
        $scope.findOne = function() {
            $scope.compra = Compras.get({
                compraId: $stateParams.compraId
            });
        };
        //Articulos
        $scope.newArticulo = {'cantidad':1};
        $scope.saveNewArticulo = function() {
            if ($scope.isValidNewArticulo) {
                $scope.compra.articulos.push($scope.newArticulo);
                $scope.newArticulo = {};
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
            }else if (!angular.isDefined(value.fechaVencimiento)) {
                $scope.error = 'Ingrese el precio.';
            } else{
                $scope.isValidNewArticulo = true;
            }

        }, true);

        $scope.showError = function(){
            console.log('showError');
        }
    }
])
    .directive('switch', ['$timeout', function ($timeout){
        return {
            restrict: 'A',
            link: function (scope, element, attr) {
                $timeout(function() {
                    $(element).wrap('<div class="switch" />').parent().bootstrapSwitch();
                });
            }
        }
    }]);