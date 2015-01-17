'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var tipoproductos = require('../../app/controllers/tipoproductos.server.controller');

	// Tipoproductos Routes
	app.route('/tipoproductos')
		.get(tipoproductos.list)
		.post(users.requiresLogin, tipoproductos.create);

	app.route('/tipoproductos/:tipoproductoId')
		.get(tipoproductos.read)
		.put(users.requiresLogin, tipoproductos.hasAuthorization, tipoproductos.update)
		.delete(users.requiresLogin, tipoproductos.hasAuthorization, tipoproductos.delete);

	// Finish by binding the Tipoproducto middleware
	app.param('tipoproductoId', tipoproductos.tipoproductoByID);
};
