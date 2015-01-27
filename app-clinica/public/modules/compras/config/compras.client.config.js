'use strict';

// Configuring the Articles module
angular.module('compras').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Compras', 'compras', 'dropdown', '/compras(/create)?');
		Menus.addSubMenuItem('topbar', 'compras', 'List Compras', 'compras');
		Menus.addSubMenuItem('topbar', 'compras', 'New Compra', 'compras/create');
	}
]);