'use strict';

//Setting up route
angular.module('consumos').config(['$stateProvider',
	function($stateProvider) {
		// Consumos state routing
		$stateProvider.
		state('listConsumos', {
			url: '/consumos',
			templateUrl: 'modules/consumos/views/list-consumos.client.view.html'
		}).
		state('createConsumo', {
			url: '/consumos/create',
			templateUrl: 'modules/consumos/views/create-consumo.client.view.html'
		}).
		state('viewConsumo', {
			url: '/consumos/:consumoId',
			templateUrl: 'modules/consumos/views/view-consumo.client.view.html'
		}).
		state('editConsumo', {
			url: '/consumos/:consumoId/edit',
			templateUrl: 'modules/consumos/views/edit-consumo.client.view.html'
		});
	}
]);