'use strict';

//Proveedores service used to communicate Proveedores REST endpoints
angular.module('proveedores').factory('Proveedores', ['$resource',
	function($resource) {
		return $resource('proveedores/:proveedoreId', { proveedoreId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]).service('Proveedor', [function() {

    var newProveedor = null;
    return {
        setNewProveedor: function(proveedor) {
            newProveedor = proveedor;
        },
        getNewProveedor: function(){
            return newProveedor;
        }
    };

}]);
