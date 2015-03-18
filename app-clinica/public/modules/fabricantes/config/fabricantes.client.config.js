'use strict';

// Configuring the Articles module
angular.module('fabricantes').run(['Menus',
	function(Menus) {
		//Menus.addMenuItem('topbar', 'Fabricantes', 'fabricantes', 'item');
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Admin', 'admin', 'dropdown', '');
		Menus.addSubMenuItem('topbar', 'admin', 'Fabricantes', 'fabricantes');
		//Menus.addSubMenuItem('topbar', 'fabricantes', 'Nuevo Fabricante', 'fabricantes/create');
		
	}
]);