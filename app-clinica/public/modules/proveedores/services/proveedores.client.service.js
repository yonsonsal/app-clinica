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
]);