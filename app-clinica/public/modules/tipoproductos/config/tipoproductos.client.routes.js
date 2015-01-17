'use strict';

//Setting up route
angular.module('tipoproductos').config(['$stateProvider',
	function($stateProvider) {
		// Tipoproductos state routing
		$stateProvider.
		state('listTipoproductos', {
			url: '/tipoproductos',
			templateUrl: 'modules/tipoproductos/views/list-tipoproductos.client.view.html'
		}).
		state('createTipoproducto', {
			url: '/tipoproductos/create',
			templateUrl: 'modules/tipoproductos/views/create-tipoproducto.client.view.html'
		}).
		state('viewTipoproducto', {
			url: '/tipoproductos/:tipoproductoId',
			templateUrl: 'modules/tipoproductos/views/view-tipoproducto.client.view.html'
		}).
		state('editTipoproducto', {
			url: '/tipoproductos/:tipoproductoId/edit',
			templateUrl: 'modules/tipoproductos/views/edit-tipoproducto.client.view.html'
		});
	}
]);