'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var consumos = require('../../app/controllers/consumos.server.controller');

	// Consumos Routes
	app.route('/consumos')
		.get(consumos.list)
		.post(users.requiresLogin, consumos.create);

	app.route('/consumos/:consumoId')
		.get(consumos.read)
		.put(users.requiresLogin, consumos.hasAuthorization, consumos.update)
		.delete(users.requiresLogin, consumos.hasAuthorization, consumos.delete);

	// Finish by binding the Consumo middleware
	app.param('consumoId', consumos.consumoByID);
};
