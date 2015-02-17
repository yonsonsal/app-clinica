'use strict';

//Pagos service used to communicate Pagos REST endpoints
angular.module('pagos').factory('Pagos', ['$resource',
	function($resource) {
		return $resource('pagos/:pagoId', { pagoId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);