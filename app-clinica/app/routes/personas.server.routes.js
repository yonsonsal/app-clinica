'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var personas = require('../../app/controllers/personas.server.controller');

	// Personas Routes
	app.route('/personas')
		.get(personas.list)
		.post(users.requiresLogin, personas.create);

	app.route('/personas/:personaId')
		.get(personas.read)
		.put(users.requiresLogin, personas.hasAuthorization, personas.update)
		.delete(users.requiresLogin, personas.hasAuthorization, personas.delete);

	// Finish by binding the Persona middleware
	app.param('personaId', personas.personaByID);
};
