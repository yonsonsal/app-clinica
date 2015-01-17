'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Proveedore = mongoose.model('Proveedore'),
	_ = require('lodash');

/**
 * Create a Proveedore
 */
exports.create = function(req, res) {
	var proveedore = new Proveedore(req.body);
	proveedore.user = req.user;

	proveedore.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(proveedore);
		}
	});
};

/**
 * Show the current Proveedore
 */
exports.read = function(req, res) {
	res.jsonp(req.proveedore);
};

/**
 * Update a Proveedore
 */
exports.update = function(req, res) {
	var proveedore = req.proveedore ;

	proveedore = _.extend(proveedore , req.body);

	proveedore.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(proveedore);
		}
	});
};

/**
 * Delete an Proveedore
 */
exports.delete = function(req, res) {
	var proveedore = req.proveedore ;

	proveedore.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(proveedore);
		}
	});
};

/**
 * List of Proveedores
 */
exports.list = function(req, res) { 
	Proveedore.find().sort('-created').populate('user', 'displayName').exec(function(err, proveedores) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(proveedores);
		}
	});
};

/**
 * Proveedore middleware
 */
exports.proveedoreByID = function(req, res, next, id) { 
	Proveedore.findById(id).populate('user', 'displayName').exec(function(err, proveedore) {
		if (err) return next(err);
		if (! proveedore) return next(new Error('Failed to load Proveedore ' + id));
		req.proveedore = proveedore ;
		next();
	});
};

/**
 * Proveedore authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.proveedore.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
