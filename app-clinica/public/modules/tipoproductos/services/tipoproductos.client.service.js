'use strict';

//Tipoproductos service used to communicate Tipoproductos REST endpoints
angular.module('tipoproductos').factory('Tipoproductos', ['$resource',
	function($resource) {
		return $resource('tipoproductos/:tipoproductoId', { tipoproductoId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);