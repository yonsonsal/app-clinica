'use strict';

//Setting up route
angular.module('proveedores').config(['$stateProvider',
	function($stateProvider) {
		// Proveedores state routing
		$stateProvider.
		state('listProveedores', {
			url: '/proveedores',
			templateUrl: 'modules/proveedores/views/list-proveedores.client.view.html'
		}).
		state('createProveedore', {
			url: '/proveedores/create',
			templateUrl: 'modules/proveedores/views/create-proveedore.client.view.html'
		}).
		state('viewProveedore', {
			url: '/proveedores/:proveedoreId',
			templateUrl: 'modules/proveedores/views/view-proveedore.client.view.html'
		}).
		state('editProveedore', {
			url: '/proveedores/:proveedoreId/edit',
			templateUrl: 'modules/proveedores/views/edit-proveedore.client.view.html'
		});
	}
]);