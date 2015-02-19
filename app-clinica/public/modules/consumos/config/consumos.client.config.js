'use strict';

// Configuring the Articles module
angular.module('consumos').run(['Menus',
	function(Menus) {
		// Set top bar menu items
        Menus.addMenuItem('topbar', 'Consumos', 'consumos', 'item');
	}
]);