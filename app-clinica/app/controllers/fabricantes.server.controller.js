'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Fabricante = mongoose.model('Fabricante'),
	_ = require('lodash');

/**
 * Create a Fabricante
 */
exports.create = function(req, res) {
	var fabricante = new Fabricante(req.body);
	fabricante.user = req.user;

	fabricante.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(fabricante);
		}
	});
};

/**
 * Show the current Fabricante
 */
exports.read = function(req, res) {
	res.jsonp(req.fabricante);
};

/**
 * Update a Fabricante
 */
exports.update = function(req, res) {
	var fabricante = req.fabricante ;

	fabricante = _.extend(fabricante , req.body);

	fabricante.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(fabricante);
		}
	});
};

/**
 * Delete an Fabricante
 */
exports.delete = function(req, res) {
	var fabricante = req.fabricante ;

	fabricante.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(fabricante);
		}
	});
};

/**
 * List of Fabricantes
 */
exports.list = function(req, res) { 
	Fabricante.find().sort('-created').populate('user', 'displayName').exec(function(err, fabricantes) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(fabricantes);
		}
	});
};

/**
 * Fabricante middleware
 */
exports.fabricanteByID = function(req, res, next, id) { 
	Fabricante.findById(id).populate('user', 'displayName').exec(function(err, fabricante) {
		if (err) return next(err);
		if (! fabricante) return next(new Error('Failed to load Fabricante ' + id));
		req.fabricante = fabricante ;
		next();
	});
};

/**
 * Fabricante authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.fabricante.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
