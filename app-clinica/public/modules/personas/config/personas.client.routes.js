'use strict';

//Setting up route
angular.module('personas').config(['$stateProvider',
	function($stateProvider) {
		// Personas state routing
		$stateProvider.
		state('listPersonas', {
			url: '/personas',
			templateUrl: 'modules/personas/views/list-personas.client.view.html'
		}).
		state('createPersona', {
			url: '/personas/create',
			templateUrl: 'modules/personas/views/create-persona.client.view.html'
		}).
		state('viewPersona', {
			url: '/personas/:personaId',
			templateUrl: 'modules/personas/views/view-persona.client.view.html'
		}).
		state('editPersona', {
			url: '/personas/:personaId/edit',
			templateUrl: 'modules/personas/views/edit-persona.client.view.html'
		});
	}
]);