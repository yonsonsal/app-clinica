'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var proveedores = require('../../app/controllers/proveedores.server.controller');

	// Proveedores Routes
	app.route('/proveedores')
		.get(proveedores.list)
		.post(users.requiresLogin, proveedores.create);

	app.route('/proveedores/:proveedoreId')
		.get(proveedores.read)
		.put(users.requiresLogin, proveedores.hasAuthorization, proveedores.update)
		.delete(users.requiresLogin, proveedores.hasAuthorization, proveedores.delete);

	// Finish by binding the Proveedore middleware
	app.param('proveedoreId', proveedores.proveedoreByID);
};
