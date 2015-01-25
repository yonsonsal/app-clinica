'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Persona = mongoose.model('Persona'),
	_ = require('lodash');

/**
 * Create a Persona
 */
exports.create = function(req, res) {
	var persona = new Persona(req.body);
	persona.user = req.user;

	persona.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(persona);
		}
	});
};

/**
 * Show the current Persona
 */
exports.read = function(req, res) {
	res.jsonp(req.persona);
};

/**
 * Update a Persona
 */
exports.update = function(req, res) {
	var persona = req.persona ;

	persona = _.extend(persona , req.body);

	persona.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(persona);
		}
	});
};

/**
 * Delete an Persona
 */
exports.delete = function(req, res) {
	var persona = req.persona ;

	persona.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(persona);
		}
	});
};

/**
 * List of Personas
 */
exports.list = function(req, res) { 
	Persona.find().sort('-created').populate('user', 'displayName').exec(function(err, personas) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(personas);
		}
	});
};

/**
 * Persona middleware
 */
exports.personaByID = function(req, res, next, id) { 
	Persona.findById(id).populate('user', 'displayName').exec(function(err, persona) {
		if (err) return next(err);
		if (! persona) return next(new Error('Failed to load Persona ' + id));
		req.persona = persona ;
		next();
	});
};

/**
 * Persona authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.persona.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
