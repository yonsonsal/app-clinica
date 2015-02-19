'use strict';

// Configuring the Articles module
angular.module('compras').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Compras', 'compras', 'item');
	}
]);