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
	producto: {
        type: Schema.ObjectId,
        ref: 'Producto'
	},
    moneda:{
        type: String,
        default: 'UYU',
        required: 'La moneda es requerida'
    },
    precio:{
        type: Number,
        required: 'El precio del artículo es requerido'
    },
    cantidad:{
        type: Number,
        required: 'La cantidad es requerida',
        default: 1
    },
    fechaVencimiento:{
        type: Date
    },
	created: {
		type: Date,
		default: Date.now
	}
});

mongoose.model('Articulo', ArticuloSchema);