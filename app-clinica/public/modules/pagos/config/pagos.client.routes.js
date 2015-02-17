'use strict';

//Setting up route
angular.module('pagos').config(['$stateProvider',
	function($stateProvider) {
		// Pagos state routing
		$stateProvider.
		state('listPagos', {
			url: '/pagos',
			templateUrl: 'modules/pagos/views/list-pagos.client.view.html'
		}).
		state('createPago', {
			url: '/pagos/create',
			templateUrl: 'modules/pagos/views/create-pago.client.view.html'
		}).
		state('viewPago', {
			url: '/pagos/:pagoId',
			templateUrl: 'modules/pagos/views/view-pago.client.view.html'
		}).
		state('editPago', {
			url: '/pagos/:pagoId/edit',
			templateUrl: 'modules/pagos/views/edit-pago.client.view.html'
		});
	}
]);