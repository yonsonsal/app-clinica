'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Compra = mongoose.model('Compra'),
    Producto = mongoose.model('Producto'),
	_ = require('lodash');

/**
 * Create a Compra
 */
exports.create = function(req, res) {
	var compra = new Compra(req.body);
	compra.user = req.user;

	compra.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(compra);
		}
	});
};

/**
 * Show the current Compra
 */
exports.read = function(req, res) {
	res.jsonp(req.compra);
};

/**
 * Update a Compra
 */
exports.update = function(req, res) {
	var compra = req.compra ;

	compra = _.extend(compra , req.body);

	compra.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(compra);
		}
	});
};

/**
 * Delete an Compra
 */
exports.delete = function(req, res) {
    var compra = req.compra;

    req.compra.articulos.forEach(function(articulo){

        Producto.findById(articulo.producto).exec(
            function(err, producto) {
                console.log(producto);
                producto.stockActual = producto.stockActual - articulo.cantidad;
                producto.save(function(err){
                    if (err) {
                        return res.status(400).send({
                            message: errorHandler.getErrorMessage(err)
                        });
                    }
                });
            }
        );
    });
    var id = req.compra._id;
    Compra.findById(id)
        .exec(function (err, compra) {
            if (err) {
                return next(err)
            }
            if (!compra) {
                return next(new Error('Failed to load Compra ' + id))
            }
            compra.remove(function (err) {
                if (err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                } else {
                    res.jsonp(compra);
                }
            });
        });
}

/**
 * List of Compras
 */
exports.list = function(req, res) { 
	Compra.find().sort('-fecha')
        .populate('user', 'displayName')
        .populate('articulos')
        .populate('articulos.producto')
        .populate('proveedor').exec(function(err, compras) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
            /*compras.articulos.forEach(function(articulo){
                    articulo.name ='pepe';

            });*/

			res.jsonp(compras);
		}
	});
};

/**
 * Compra middleware
 */
exports.compraByID = function(req, res, next, id) { 
	Compra.findById(id)
        .lean()
        .populate('user', 'displayName')
        .populate('articulos')
        .populate('proveedor')
        .exec(function(err, compra) {
            if (err){
                return next(err)
            }
            if (! compra) {
                return next(new Error('Failed to load Compra ' + id))
            }

            var options = {
                path: 'articulos.producto',
                model: 'Producto'
            }
            Compra.populate(compra, options, function(err, compraAux){

                req.compra = compraAux ;
                next();
            });

	});
};

/**
 * Compra authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.compra.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
