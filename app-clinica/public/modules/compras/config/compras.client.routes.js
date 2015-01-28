'use strict';

//Setting up route
angular.module('compras').config(['$stateProvider',
	function($stateProvider) {
		// Compras state routing
		$stateProvider.
		state('listCompras', {
			url: '/compras',
			templateUrl: 'modules/compras/views/list-compras.client.view.html'
		}).
		state('createCompra', {
			url: '/compras/create',
			templateUrl: 'modules/compras/views/create-compra.client.view.html'
		}).
		state('viewCompra', {
			url: '/compras/:compraId',
			templateUrl: 'modules/compras/views/view-compra.client.view.html'
		}).
		state('editCompra', {
			url: '/compras/:compraId/edit',
			templateUrl: 'modules/compras/views/edit-compra.client.view.html'
		});
	}
]);