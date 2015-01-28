'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var compras = require('../../app/controllers/compras.server.controller');

	// Compras Routes
	app.route('/compras')
		.get(compras.list)
		.post(users.requiresLogin, compras.create);

	app.route('/compras/:compraId')
		.get(compras.read)
		.put(users.requiresLogin, compras.hasAuthorization, compras.update)
		.delete(users.requiresLogin, compras.hasAuthorization, compras.delete);

	// Finish by binding the Compra middleware
	app.param('compraId', compras.compraByID);
};
