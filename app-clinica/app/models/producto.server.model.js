'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Producto Schema
 */
var ProductoSchema = new Schema({
	nombre: {
		type: String,
		default: '',
		required: 'El campo nombre es obligatorio.',
		trim: true
	},
    tipoProducto:{
        type:Schema.ObjectId,
        ref:'Tipoproducto',
        required: 'El tipo de producto es obligatorio.'
    },
    fabricante:{
        type:Schema.ObjectId,
        ref:'Fabricante'
    },
    tamanio:{
        type: String,
        default: '',
        required: 'El campo Tamaño es obligatorio.',
        trim: true
    },
    stockMinimo:{
        type: Number,
        default: 0,
        required: 'El campo stock mínimo es obligatorio.',
        trim: true
    },
    fraccionable:{
        type: Boolean,
        default: false,
        trim: true
    },
    consumible:{
        type: Boolean,
        default: false,
        trim: true
    },
    observaciones:{
        type: String,
        default: '',
        trim: true
    },
    codigoBarras:{
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

mongoose.model('Producto', ProductoSchema);