'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var articulos = require('../../app/controllers/articulos.server.controller');

	// Articulos Routes
	app.route('/articulos')
		.get(articulos.list)
		.post(users.requiresLogin, articulos.create);

	app.route('/articulos/:articuloId')
		.get(articulos.read)
		.put(users.requiresLogin, articulos.hasAuthorization, articulos.update)
		.delete(users.requiresLogin, articulos.hasAuthorization, articulos.delete);

	// Finish by binding the Articulo middleware
	app.param('articuloId', articulos.articuloByID);
};
