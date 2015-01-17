'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var fabricantes = require('../../app/controllers/fabricantes.server.controller');

	// Fabricantes Routes
	app.route('/fabricantes')
		.get(fabricantes.list)
		.post(users.requiresLogin, fabricantes.create);

	app.route('/fabricantes/:fabricanteId')
		.get(fabricantes.read)
		.put(users.requiresLogin, fabricantes.hasAuthorization, fabricantes.update)
		.delete(users.requiresLogin, fabricantes.hasAuthorization, fabricantes.delete);

	// Finish by binding the Fabricante middleware
	app.param('fabricanteId', fabricantes.fabricanteByID);
};
