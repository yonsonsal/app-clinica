'use strict';

//Productos service used to communicate Productos REST endpoints
angular.module('productos').service('Producto',['Productos', function(Productos){

    var newProducto = {};
    var productos = [];

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
        }
    }
}]);