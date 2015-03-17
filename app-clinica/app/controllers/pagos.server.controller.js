'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Pago = mongoose.model('Pago'),
	_ = require('lodash');

/**
 * Create a Pago
 */
exports.create = function(req, res) {
    console.log(req.body);
	var pago = new Pago(req.body);
	pago.user = req.user;

	pago.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(pago);
		}
	});
};

/**
 * Show the current Pago
 */
exports.read = function(req, res) {
	res.jsonp(req.pago);
};

/**
 * Update a Pago
 */
exports.update = function(req, res) {
	var pago = req.pago ;

	pago = _.extend(pago , req.body);

	pago.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(pago);
		}
	});
};

/**
 * Delete an Pago
 */
exports.delete = function(req, res) {
	var pago = req.pago ;

	pago.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(pago);
		}
	});
};

/**
 * List of Pagos
 */
exports.list = function(req, res) { 
	Pago.find().sort('-created').populate('user', 'displayName').exec(function(err, pagos) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(pagos);
		}
	});
};

/**
 * Pago middleware
 */
exports.pagoByID = function(req, res, next, id) { 
	Pago.findById(id).populate('user', 'displayName').exec(function(err, pago) {
		if (err) return next(err);
		if (! pago) return next(new Error('Failed to load Pago ' + id));
		req.pago = pago ;
		next();
	});
};

/**
 * Pago authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	next();
};
