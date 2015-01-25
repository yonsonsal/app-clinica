'use strict';

// Configuring the Articles module
angular.module('personas').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Personas', 'personas', 'dropdown', '/personas(/create)?');
		Menus.addSubMenuItem('topbar', 'personas', 'List Personas', 'personas');
		Menus.addSubMenuItem('topbar', 'personas', 'New Persona', 'personas/create');
	}
]);