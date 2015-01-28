'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Consumo = mongoose.model('Consumo'),
	_ = require('lodash');

/**
 * Create a Consumo
 */
exports.create = function(req, res) {
	var consumo = new Consumo(req.body);
	consumo.user = req.user;

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
	Consumo.find().sort('-created').populate('user', 'displayName').exec(function(err, consumos) {
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
	Consumo.findById(id).populate('user', 'displayName').exec(function(err, consumo) {
		if (err) return next(err);
		if (! consumo) return next(new Error('Failed to load Consumo ' + id));
		req.consumo = consumo ;
		next();
	});
};

/**
 * Consumo authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.consumo.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
