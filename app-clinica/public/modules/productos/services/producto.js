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
        }
    }
}]);