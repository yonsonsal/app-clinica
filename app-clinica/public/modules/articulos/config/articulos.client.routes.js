'use strict';

//Setting up route
angular.module('articulos').config(['$stateProvider',
	function($stateProvider) {
		// Articulos state routing
		$stateProvider.
		state('listArticulos', {
			url: '/articulos',
			templateUrl: 'modules/articulos/views/list-articulos.client.view.html'
		}).
		state('createArticulo', {
			url: '/articulos/create',
			templateUrl: 'modules/articulos/views/create-articulo.client.view.html'
		}).
		state('viewArticulo', {
			url: '/articulos/:articuloId',
			templateUrl: 'modules/articulos/views/view-articulo.client.view.html'
		}).
		state('editArticulo', {
			url: '/articulos/:articuloId/edit',
			templateUrl: 'modules/articulos/views/edit-articulo.client.view.html'
		});
	}
]);