'use strict';

//Consumos service used to communicate Consumos REST endpoints
angular.module('consumos').factory('Consumos', ['$resource',
	function($resource) {
		return $resource('consumos/:consumoId', { consumoId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]).service('Consumo', [function(){
    var newConsumo = null;

    return{
        setNewConsumo: function(consumo){
            newConsumo = consumo;
        },
        getNewConsumo: function(){
            return newConsumo;
        }
    }
}]);
