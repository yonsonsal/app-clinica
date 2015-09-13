'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Servicio Schema
 */
var ServicioSchema = new Schema({
	descripcion: {
		type: String,
		default: '',
		required: 'El Nombre del servicio es obligatorio',
		trim: true
	},
    moneda: {
        type: String,
        default: 'UYU',
        trim: true
    },
    precio:{
        type: Number,
        required: 'El Precio del servicio es obligatorio'
    },
		iva:{
			type: Number,
			default:22
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

mongoose.model('Servicio', ServicioSchema);
