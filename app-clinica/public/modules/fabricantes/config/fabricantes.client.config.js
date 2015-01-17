'use strict';

// Configuring the Articles module
angular.module('fabricantes').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Fabricantes', 'fabricantes', 'dropdown', '/fabricantes(/create)?');
		Menus.addSubMenuItem('topbar', 'fabricantes', 'Lista de Fabricantes', 'fabricantes');
		Menus.addSubMenuItem('topbar', 'fabricantes', 'Nuevo Fabricante', 'fabricantes/create');
	}
]);