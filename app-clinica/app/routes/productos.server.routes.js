'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var productos = require('../../app/controllers/productos.server.controller');

	// Productos Routes
	app.route('/productos')
		.get(productos.list)
		.post(users.requiresLogin, productos.create);

	app.route('/productos/:productoId')
		.get(productos.read)
		.put(users.requiresLogin, productos.hasAuthorization, productos.update)
		.delete(users.requiresLogin, productos.hasAuthorization, productos.delete);

	// Finish by binding the Producto middleware
	app.param('productoId', productos.productoByID);
};
