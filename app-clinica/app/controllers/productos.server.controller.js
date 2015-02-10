'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Producto = mongoose.model('Producto'),
	_ = require('lodash');

/**
 * Create a Producto
 */
exports.create = function(req, res) {
	var producto = new Producto(req.body);
	producto.user = req.user;

	producto.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {

			res.jsonp(producto);
		}
	});
};

/**
 * Show the current Producto
 */
exports.read = function(req, res) {
	res.jsonp(req.producto);
};

/**
 * Update a Producto
 */
exports.update = function(req, res) {
	var producto = req.producto ;

	producto = _.extend(producto , req.body);

	producto.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(producto);
		}
	});
};

/**
 * Delete an Producto
 */
exports.delete = function(req, res) {
	var producto = req.producto ;

	producto.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(producto);
		}
	});
};

/**
 * List of Productos
 */
exports.list = function(req, res) {
    //console.log(req.params);
	var query = Producto.find()
        .sort('-created')
        .populate('user', 'displayName')
        .populate('tipoProducto')
        .populate('fabricante');

    if(req.stockActual) {
        query.where('stockAct');
    }
        query.exec(function(err, productos) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                res.jsonp(productos);
            }
	});
};

/**
 * Producto middleware
 */
exports.productoByID = function(req, res, next, id) { 
	Producto.findById(id)
        .populate('user', 'displayName')
        .populate('tipoProducto')
        .populate('fabricante').exec(function(err, producto) {
                if (err) {
                    return next(err)
                };
                if (! producto) {
                    return next(new Error('Failed to load Producto ' + id))
                };
                req.producto = producto ;
                next();
	});
};

/**
 * Producto authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.producto.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
