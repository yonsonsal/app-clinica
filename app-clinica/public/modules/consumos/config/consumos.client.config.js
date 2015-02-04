'use strict';

// Configuring the Articles module
angular.module('consumos').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Consumos', 'consumos', 'dropdown', '/consumos(/create)?');
		Menus.addSubMenuItem('topbar', 'consumos', 'Lista de Consumos', 'consumos');
		Menus.addSubMenuItem('topbar', 'consumos', 'Nuevo Consumo', 'consumos/create');
	}
]);