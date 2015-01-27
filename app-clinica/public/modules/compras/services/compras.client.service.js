'use strict';

//Compras service used to communicate Compras REST endpoints
angular.module('compras').factory('Compras', ['$resource',
	function($resource) {
		return $resource('compras/:compraId', { compraId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);