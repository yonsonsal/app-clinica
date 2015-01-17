'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Fabricante Schema
 */
var FabricanteSchema = new Schema({
	nombre: {
		type: String,
		default: '',
		required: 'El nombre del fabricante es requerido',
		trim: true
	},
    origen: {
        type: String,
        default: '',
        required: 'El origen del fabricante es requerido',
        trim: true
    },
    observaciones: {
        type: String,
        default: '',
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

mongoose.model('Fabricante', FabricanteSchema);