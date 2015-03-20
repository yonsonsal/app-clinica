'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Consumo = mongoose.model('Consumo'),
    Producto = mongoose.model('Producto'),
	_ = require('lodash');

/**
 * Create a Consumo
 */
exports.create = function(req, res) {
	var consumo = new Consumo(req.body);
	consumo.user = req.user;

    consumo.productos.forEach(function(producto){
        if (producto.producto.tipoProducto) {
            Producto.findById(producto.producto._id)
                .exec(function (err, productoLoaded) {
                    if (err) {
                        return next(err)
                    };
                    productoLoaded.stockActual = productoLoaded.stockActual - producto.cantidad;
                    productoLoaded.save(function (err) {
                        if (err) {
                            return res.status(400).send({
                                message: errorHandler.getErrorMessage(err)
                            });
                        }
                    });

                });
        }

    });
	consumo.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(consumo);
		}
	});
};

/**
 * Show the current Consumo
 */
exports.read = function(req, res) {
	res.jsonp(req.consumo);
};

/**
 * Update a Consumo
 */
exports.update = function(req, res) {
	var consumo = req.consumo ;

	consumo = _.extend(consumo , req.body);

	consumo.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(consumo);
		}
	});
};

/**
 * Delete an Consumo
 */
exports.delete = function(req, res) {
	var consumo = req.consumo ;

    consumo.productos.forEach(function(articulo){
        console.log(articulo);

        if(articulo.producto.tipoProducto && articulo.producto.consumible) {

            if (articulo.producto.tipoProducto) {
                Producto.findById(articulo.producto._id).exec(
                    function (err, producto) {
                        console.log(producto);
                        if (!err && producto && producto.consumible) {
                            producto.stockActual = producto.stockActual + articulo.cantidad;
                            producto.save(function (err) {
                                if (err) {
                                    return res.status(400).send({
                                        message: errorHandler.getErrorMessage(err)
                                    });
                                } else {

                                }
                            });
                        }
                    });
            }
        }
    });
	consumo.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(consumo);
		}
	});
};

/**
 * List of Consumos
 */
exports.list = function(req, res) { 
	Consumo.find().populate('user', 'displayName')
                  .populate('persona').
                    sort({fecha: 'ascending'})
                  .exec(function(err, consumos) {
                    if (err) {
                        return res.status(400).send({
                            message: errorHandler.getErrorMessage(err)
                        });
                    } else {
                        res.jsonp(consumos);
                    }
	});
};

/**
 * Consumo middleware
 */
exports.consumoByID = function(req, res, next, id) { 
	Consumo.findById(id)
        .populate('user', 'displayName')
        .populate('persona')
        .populate('')
        .exec(function(err, consumo) {
            if (err){
                return next(err)
            }
            if (! consumo) {
                return next(new Error('Failed to load Consumo ' + id))
            }
            var options = {
                path: 'articulos.producto',
                model: 'Producto'
            };
            Consumo.populate(consumo, options, function(err, consumoAux){

                req.consumo = consumoAux ;
                next();
            });
         });
};

/**
 * Consumo authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
    //console.log(req.user);
	/*if (req.consumo.user.id) {
		return res.status(403).send('User is not authorized');
	}*/
	next();
};
