'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Servicio = mongoose.model('Servicio'),
	_ = require('lodash');

/**
 * Create a Servicio
 */
exports.create = function(req, res) {
	var servicio = new Servicio(req.body);
	servicio.user = req.user;

	servicio.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(servicio);
		}
	});
};

/**
 * Show the current Servicio
 */
exports.read = function(req, res) {
	res.jsonp(req.servicio);
};

/**
 * Update a Servicio
 */
exports.update = function(req, res) {
	var servicio = req.servicio ;

	servicio = _.extend(servicio , req.body);

	servicio.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(servicio);
		}
	});
};

/**
 * Delete an Servicio
 */
exports.delete = function(req, res) {
	var servicio = req.servicio ;

	servicio.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(servicio);
		}
	});
};

/**
 * List of Servicios
 */
exports.list = function(req, res) { 
	Servicio.find().sort('-created').populate('user', 'displayName').exec(function(err, servicios) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(servicios);
		}
	});
};

/**
 * Servicio middleware
 */
exports.servicioByID = function(req, res, next, id) { 
	Servicio.findById(id).populate('user', 'displayName').exec(function(err, servicio) {
		if (err) return next(err);
		if (! servicio) return next(new Error('Failed to load Servicio ' + id));
		req.servicio = servicio ;
		next();
	});
};

/**
 * Servicio authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	next();
};
