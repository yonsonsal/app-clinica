'use strict';

// Configuring the Articles module
angular.module('productos').run(['Menus',
	function(Menus) {
		// Set top bar menu items
        Menus.addMenuItem('topbar', 'Productos', 'productos', 'item');
	}
]);