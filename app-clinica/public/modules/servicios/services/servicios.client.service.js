'use strict';

//Servicios service used to communicate Servicios REST endpoints
angular.module('servicios').factory('Servicios', ['$resource',
	function($resource) {
		return $resource('servicios/:servicioId', { servicioId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]).service('Servicio',[function(){

    var newServicio = null;

    return{
        setNewServicio: function(servicio){
            newServicio = servicio;
        },
        getNewServicio: function(){
            return newServicio;
        }
    }
}]);
