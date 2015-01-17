'use strict';

//Fabricantes service used to communicate Fabricantes REST endpoints
angular.module('fabricantes').factory('Fabricantes', ['$resource',
	function($resource) {
		return $resource('fabricantes/:fabricanteId', { fabricanteId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);