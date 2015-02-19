'use strict';

// Configuring the Articles module
angular.module('servicios').run(['Menus',
	function(Menus) {
		// Set top bar menu items
        Menus.addMenuItem('topbar', 'Servicios', 'servicios', 'item');
	}
]);