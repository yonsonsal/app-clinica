'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Consumo Schema
 */
var ConsumoSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Consumo name',
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

mongoose.model('Consumo', ConsumoSchema);