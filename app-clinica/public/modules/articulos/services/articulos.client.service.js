'use strict';

//Articulos service used to communicate Articulos REST endpoints
angular.module('articulos').factory('Articulos', ['$resource',
	function($resource) {
		return $resource('articulos/:articuloId', { articuloId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);