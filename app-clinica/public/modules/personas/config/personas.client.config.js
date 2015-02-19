'use strict';

// Configuring the Articles module
angular.module('personas').run(['Menus',
	function(Menus) {
		// Set top bar menu items
        Menus.addMenuItem('topbar', 'Personas', 'personas', 'item');

	}
]);