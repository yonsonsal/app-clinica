'use strict';

// Configuring the Articles module
angular.module('servicios').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Servicios', 'servicios', 'dropdown', '/servicios(/create)?');
		Menus.addSubMenuItem('topbar', 'servicios', 'List Servicios', 'servicios');
		Menus.addSubMenuItem('topbar', 'servicios', 'New Servicio', 'servicios/create');
	}
]);