'use strict';

//Setting up route
angular.module('fabricantes').config(['$stateProvider',
	function($stateProvider) {
		// Fabricantes state routing
		$stateProvider.
		state('listFabricantes', {
			url: '/fabricantes',
			templateUrl: 'modules/fabricantes/views/list-fabricantes.client.view.html'
		}).
		state('createFabricante', {
			url: '/fabricantes/create',
			templateUrl: 'modules/fabricantes/views/create-fabricante.client.view.html'
		}).
		state('viewFabricante', {
			url: '/fabricantes/:fabricanteId',
			templateUrl: 'modules/fabricantes/views/view-fabricante.client.view.html'
		}).
		state('editFabricante', {
			url: '/fabricantes/:fabricanteId/edit',
			templateUrl: 'modules/fabricantes/views/edit-fabricante.client.view.html'
		});
	}
]);