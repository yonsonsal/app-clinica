'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Compra Schema
 */
var CompraSchema = new Schema({
	factura:{
      type:String,
      require:'El número de factura es requerido'
    },
    proveedor: {
        type: Schema.ObjectId,
        ref: 'Proveedore'
	},
    articulos:[{ type : Schema.ObjectId, ref: 'Articulo' }],
    pago:{
        type: Boolean,
        default: true,
        require:'Pago es requerido'
    },
    monto:{
        type: Number,
        require:'Monto es requerido'
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

mongoose.model('Compra', CompraSchema);