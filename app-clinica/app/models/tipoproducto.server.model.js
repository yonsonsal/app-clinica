'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Tipoproducto Schema
 */
var TipoproductoSchema = new Schema({
	nombre: {
		type: String,
		default: '',
		required: 'El campo nombre es obligatorio',
		trim: true
	},
    descripcion: {
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

mongoose.model('Tipoproducto', TipoproductoSchema);