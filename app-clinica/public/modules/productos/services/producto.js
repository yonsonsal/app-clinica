'use strict';

//Productos service used to communicate Productos REST endpoints
angular.module('productos').service('Producto',['Productos', function(Productos){

    var newProducto = {};
    var productos = [];
    var compra = null;
    var fromCompraState = false;
    var proveedor = null;

    return{
        getNewProducto: function(){
            return newProducto;
        },
        setNewProducto: function(newProductoP) {

            newProducto = newProductoP;
        },
        getProductoDescription : function(producto) {

            var toReturn = producto.tipoProducto.nombre + ' ' + producto.nombre + ' (' + producto.tamanio + ') - ' + producto.fabricante.nombre;
            return toReturn;
        },
        setCompra: function(compraAxu){

            compra = compraAxu
        },
        getCompra: function(){
            return compra;
        },
        setFlagFromCompra: function(fromCompra) {
            fromCompraState = fromCompra;
        },
        getFlagFromCompra: function(){
            return fromCompraState;
        },
        setProveedorFromCompra: function(prov){
             proveedor = prov;
        },
        getProveedorFromCompra: function(){
            return proveedor;
        }

    }
}]);
