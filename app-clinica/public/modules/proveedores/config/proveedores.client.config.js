'use strict';

// Configuring the Articles module
angular.module('proveedores').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Proveedores', 'proveedores', 'dropdown', '/proveedores(/create)?');
		Menus.addSubMenuItem('topbar', 'proveedores', 'List Proveedores', 'proveedores');
		Menus.addSubMenuItem('topbar', 'proveedores', 'New Proveedore', 'proveedores/create');
	}
]);