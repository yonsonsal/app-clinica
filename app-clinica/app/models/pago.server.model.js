'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Pago Schema
 */
var PagoSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Pago name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Pago', PagoSchema);