'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var pagos = require('../../app/controllers/pagos.server.controller');

	// Pagos Routes
	app.route('/pagos')
		.get(pagos.list)
		.post(users.requiresLogin, pagos.create);

	app.route('/pagos/:pagoId')
		.get(pagos.read)
		.put(users.requiresLogin, pagos.hasAuthorization, pagos.update)
		.delete(users.requiresLogin, pagos.hasAuthorization, pagos.delete);

	// Finish by binding the Pago middleware
	app.param('pagoId', pagos.pagoByID);
};
