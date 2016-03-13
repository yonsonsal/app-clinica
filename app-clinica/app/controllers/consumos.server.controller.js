'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Consumo = mongoose.model('Consumo'),
    Producto = mongoose.model('Producto'),
	_ = require('lodash'),
    async = require('async'),
    http = require('http');


/**
 * Create a Consumo
 */
exports.create = function(req, res) {
	var consumo = new Consumo(req.body);
  console.log(req.body);
	consumo.user = req.user;
  var aFecha =  req.body.fecha.split('T')[0].split('-');

  console.log(aFecha);
  var nuevaFecha = new Date();
  nuevaFecha.setYear(aFecha[0]);
  nuevaFecha.setMonth(aFecha[1] - 1);
  nuevaFecha.setDate(aFecha[2]);
  consumo.fecha = nuevaFecha;

    consumo.productos.forEach(function(producto){
        if (producto.producto.tipoProducto) {
            Producto.findById(producto.producto._id)
                .exec(function (err, productoLoaded) {
                    if (err) {
                        return next(err)
                    };
                    productoLoaded.stockActual = productoLoaded.stockActual - producto.cantidad;
                    productoLoaded.save(function (err) {
                        if (err) {
                            return res.status(400).send({
                                message: errorHandler.getErrorMessage(err)
                            });
                        }
                    });

                });
        }

    });
	consumo.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(consumo);
		}
	});
};

/**
 * Show the current Consumo
 */
exports.read = function(req, res) {
	res.jsonp(req.consumo);
};

/**
 * Update a Consumo
 */
exports.update = function(req, res) {
	var oldConsumo = req.consumo ;
  var newConsumo = req.body;
  console.log(oldConsumo.fecha);
  console.log(newConsumo.fecha);
  var aFecha =  newConsumo.fecha.split('T')[0].split('-');

  console.log(aFecha);
  var nuevaFecha = new Date();
  nuevaFecha.setYear(aFecha[0]);
  nuevaFecha.setMonth(aFecha[1] - 1);
  nuevaFecha.setDate(aFecha[2]);
  newConsumo.fecha = nuevaFecha;
  var productos = {};
  _(oldConsumo.productos ).forEach(function(oldArticulo){
      if (oldArticulo.producto.tipoProducto && oldArticulo.producto.consumible) {
        if (productos.hasOwnProperty(oldArticulo.producto._id)) {
          productos[oldArticulo.producto._id] += oldArticulo.cantidad;
        } else {
          productos[oldArticulo.producto._id] = oldArticulo.cantidad;
        }
      }
  });
  _(newConsumo.productos ).forEach(function(articulo){
    if (articulo.producto.tipoProducto && articulo.producto.consumible) {
      if (productos.hasOwnProperty(articulo.producto._id)) {
        productos[articulo.producto._id] -= articulo.cantidad;
      } else {
        productos[articulo.producto._id] = articulo.cantidad * -1;
      }
    }
  });

  _(productos ).forEach(function(cant, productId){
     updateProducto(productId, cant, function(){});
  });
  var consumo = _.extend ( oldConsumo, newConsumo );
  consumo.save ( function ( err ) {
    if ( err ) {
      return res.status ( 400 ).send ( {
        message : errorHandler.getErrorMessage ( err )
      } );
    } else {
      res.jsonp ( consumo );
    }
  });
};

function updateProducto(productId, cant, callback) {

  Producto.findById(productId).exec(
      function (err, producto) {

        //console.log('Update producto ', productId);
        if (!err && producto && producto.consumible) {
         producto.stockActual = producto.stockActual + cant;
          producto.save(function (err) {
            return callback(err);
          });
        } else {
          return callback(err);
        }
      }
  );
}
/**
 * Delete an Consumo
 */
exports.delete = function(req, res) {
	var consumo = req.consumo ;

    consumo.productos.forEach(function(articulo){

        if(articulo.producto.tipoProducto && articulo.producto.consumible) {

            if (articulo.producto.tipoProducto) {
                Producto.findById(articulo.producto._id).exec(
                    function (err, producto) {

                        if (!err && producto && producto.consumible) {
                            producto.stockActual = producto.stockActual + articulo.cantidad;
                            producto.save(function (err) {
                                if (err) {
                                    return res.status(400).send({
                                        message: errorHandler.getErrorMessage(err)
                                    });
                                }
                            });
                        }
                    }
                );
            }
        }
    });
	consumo.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(consumo);
		}
	});
};

/**
 * List of Consumos
 */
exports.list = function(req, res) { 
	Consumo.find().populate('user', 'displayName')
                  .populate('persona').
                    sort({fecha: 'ascending'})
                  .exec(function(err, consumos) {
                    if (err) {
                        return res.status(400).send({
                            message: errorHandler.getErrorMessage(err)
                        });
                    } else {
                        res.jsonp(consumos);
                    }
	});
};

/**
 * Consumo middleware
 */
exports.consumoByID = function(req, res, next, id) { 
	Consumo.findById(id)
        .populate('user', 'displayName')
        .populate('persona')
        .populate('')
        .exec(function(err, consumo) {
            if (err){
                return next(err)
            }
            if (! consumo) {
                return next(new Error('Failed to load Consumo ' + id))
            }
            var options = {
                path: 'articulos.producto',
                model: 'Producto'
            };
            Consumo.populate(consumo, options, function(err, consumoAux){

                req.consumo = consumoAux ;
                next();
            });
         });
};

exports.getCotizacion = function(req, res, next){
  console.log("Tamo aca");
  http.get("http://www.bcu.gub.uy/Cotizaciones/oicot110515.txt", function(response) {
    var str = '';
    response.on('data', function (chunk) {
      str += chunk;
      var aux = str.split("\r\n");
      console.log(aux);
    });
  }).on('error', function(e) {
    console.log("Got error: " + e.message);
  });
  next();
}
/**
 * Consumo authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
    //console.log(req.user);
	/*if (req.consumo.user.id) {
		return res.status(403).send('User is not authorized');
	}*/
	next();
};
