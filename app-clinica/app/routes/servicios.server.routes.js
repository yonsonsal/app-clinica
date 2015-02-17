'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var servicios = require('../../app/controllers/servicios.server.controller');

	// Servicios Routes
	app.route('/servicios')
		.get(servicios.list)
		.post(users.requiresLogin, servicios.create);

	app.route('/servicios/:servicioId')
		.get(servicios.read)
		.put(users.requiresLogin, servicios.hasAuthorization, servicios.update)
		.delete(users.requiresLogin, servicios.hasAuthorization, servicios.delete);

	// Finish by binding the Servicio middleware
	app.param('servicioId', servicios.servicioByID);
};
