'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Compra = mongoose.model('Compra'),
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
	var compra = req.compra ;

	compra.remove(function(err) {
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
 * List of Compras
 */
exports.list = function(req, res) { 
	Compra.find().sort('-created').populate('user', 'displayName').exec(function(err, compras) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(compras);
		}
	});
};

/**
 * Compra middleware
 */
exports.compraByID = function(req, res, next, id) { 
	Compra.findById(id).populate('user', 'displayName').exec(function(err, compra) {
		if (err) return next(err);
		if (! compra) return next(new Error('Failed to load Compra ' + id));
		req.compra = compra ;
		next();
	});
};

/**
 * Compra authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.compra.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
