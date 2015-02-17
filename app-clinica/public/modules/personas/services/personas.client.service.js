'use strict';

//Personas service used to communicate Personas REST endpoints
angular.module('personas').factory('Personas', ['$resource',
	function($resource) {
		return $resource('personas/:personaId', { personaId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]).service('Persona', [function(){

    var newPersona = null;

    return {
        setNewPersona: function(persona){
            newPersona = persona;
        },
        getNewPersona: function(){
            return newPersona;
        }
    };
}]);
