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
	persona: {
		type: Schema.ObjectId,
        ref: 'Persona',
		required: 'Seleccione una persona'
	},
	fecha: {
		type: Date,
		default: Date.now
	},
    productos:[{ type : Schema.Types.Mixed }],
    pago:{
        type: Boolean,
        default: true,
        require:'Pago es requerido'
    },
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Consumo', ConsumoSchema);