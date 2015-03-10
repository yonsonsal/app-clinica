'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Articulo = mongoose.model('Articulo'),
    Producto = mongoose.model('Producto'),
    Fabricante = mongoose.model('Fabricante'),
    Proveedore = mongoose.model('Proveedore'),
    Tipoproducto = mongoose.model('Tipoproducto'),
	_ = require('lodash');

/**
 * Create a Articulo
 */
exports.create = function(req, res) {
	var articulo = new Articulo(req.body);
	articulo.user = req.user;

	articulo.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
            Producto.update({_id:articulo.producto},
                             {$inc: { stockActual: articulo.cantidad }},
                             {upsert: false}, function(err){

                            });
			res.jsonp(articulo);
		}
	});
};

/**
 * Show the current Articulo
 */
exports.read = function(req, res) {
	res.jsonp(req.articulo);
};

/**
 * Update a Articulo
 */
exports.update = function(req, res) {
	var articulo = req.articulo ;

	articulo = _.extend(articulo , req.body);

	articulo.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(articulo);
		}
	});
};

/**
 * Delete an Articulo
 */
exports.delete = function(req, res) {
	var articulo = req.articulo ;

	articulo.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(articulo);
		}
	});
};

/**
 * List of Articulos
 */
exports.list = function(req, res) { 
	Articulo.find()
       // .where('producto != null')
        .sort('-created')
        .populate('user', 'displayName')
        .populate('producto')

        //.where('producto.stockActual').gt(0)
        .exec(function(err, articulos) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {

            var options = {
                path: 'producto.fabricante',
                model: 'Fabricante'
            }
            Articulo.populate(articulos, options, function (err, articulosAux) {

                var optTipoProducto = {
                    path: 'producto.tipoProducto',
                    model: 'Tipoproducto'
                };
                Articulo.populate(articulosAux, optTipoProducto, function(err, articulos){

                    res.jsonp(articulos);
                });
            });

		}
	});
};

/**
 * Articulo middleware
 */
exports.articuloByID = function(req, res, next, id) { 
	Articulo.findById(id)
        .populate('user', 'displayName')
        .populate('producto')
        .exec(function(err, articulo) {
		if (err) return next(err);
		if (! articulo) return next(new Error('Failed to load Articulo ' + id));
		req.articulo = articulo ;
		next();
	});
};

/**
 * Articulo authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	next();
};
