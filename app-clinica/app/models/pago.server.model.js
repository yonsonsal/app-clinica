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
    persona: {
        type: Schema.ObjectId,
        ref: 'Persona',
        required: 'Seleccione una persona'
    },
    consumo: {
        type: Schema.ObjectId,
        ref: 'Consumo'
    },
    monto: {
        type: String,
        required: 'El monto es requerido'
    },
    cotizacion: {
        type: String
    },
    moneda: {
        type: String,
        required: 'La moneda es requerida'
    },
    fecha: {
        type: Date,
        default: Date.now
    },
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Pago', PagoSchema);