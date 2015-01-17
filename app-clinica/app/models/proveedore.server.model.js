'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Proveedore Schema
 */
var ProveedoreSchema = new Schema({
	nombre: {
		type: String,
		default: '',
		required: 'Nombre del proveedor requerido',
		trim: true
	},
    razonSocial: {
        type: String,
        default: '',
        trim: true
    },
    rut: {
        type: String,
        default: '',
        trim: true
    },
    direccion: {
        type: String,
        default: '',
        trim: true
    },
    telefono: {
        type: String,
        default: '',
        trim: true
    },
    mail: {
        type: String,
        default: '',
        trim: true
    },
    contacto: {
        type: String,
        default: '',
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

mongoose.model('Proveedore', ProveedoreSchema);