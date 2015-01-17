'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Articulo Schema
 */
var ArticuloSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Articulo name',
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

mongoose.model('Articulo', ArticuloSchema);