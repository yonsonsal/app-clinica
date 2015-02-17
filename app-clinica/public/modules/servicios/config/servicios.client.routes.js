'use strict';

//Setting up route
angular.module('servicios').config(['$stateProvider',
	function($stateProvider) {
		// Servicios state routing
		$stateProvider.
		state('listServicios', {
			url: '/servicios',
			templateUrl: 'modules/servicios/views/list-servicios.client.view.html'
		}).
		state('createServicio', {
			url: '/servicios/create',
			templateUrl: 'modules/servicios/views/create-servicio.client.view.html'
		}).
		state('viewServicio', {
			url: '/servicios/:servicioId',
			templateUrl: 'modules/servicios/views/view-servicio.client.view.html'
		}).
		state('editServicio', {
			url: '/servicios/:servicioId/edit',
			templateUrl: 'modules/servicios/views/edit-servicio.client.view.html'
		});
	}
]);
