'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Tipoproducto = mongoose.model('Tipoproducto'),
	_ = require('lodash');

/**
 * Create a Tipoproducto
 */
exports.create = function(req, res) {
	var tipoproducto = new Tipoproducto(req.body);
	tipoproducto.user = req.user;

	tipoproducto.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(tipoproducto);
		}
	});
};

/**
 * Show the current Tipoproducto
 */
exports.read = function(req, res) {
	res.jsonp(req.tipoproducto);
};

/**
 * Update a Tipoproducto
 */
exports.update = function(req, res) {
	var tipoproducto = req.tipoproducto ;

	tipoproducto = _.extend(tipoproducto , req.body);

	tipoproducto.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(tipoproducto);
		}
	});
};

/**
 * Delete an Tipoproducto
 */
exports.delete = function(req, res) {
	var tipoproducto = req.tipoproducto ;

	tipoproducto.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(tipoproducto);
		}
	});
};

/**
 * List of Tipoproductos
 */
exports.list = function(req, res) { 
	Tipoproducto.find().sort('-created').populate('user', 'displayName').exec(function(err, tipoproductos) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(tipoproductos);
		}
	});
};

/**
 * Tipoproducto middleware
 */
exports.tipoproductoByID = function(req, res, next, id) { 
	Tipoproducto.findById(id).populate('user', 'displayName').exec(function(err, tipoproducto) {
		if (err) return next(err);
		if (! tipoproducto) return next(new Error('Failed to load Tipoproducto ' + id));
		req.tipoproducto = tipoproducto ;
		next();
	});
};

/**
 * Tipoproducto authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	next();
};
