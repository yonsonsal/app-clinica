'use strict';

// Configuring the Articles module
angular.module('proveedores').run(['Menus',
	function(Menus) {
		// Set top bar menu items
        /*
		Menus.addMenuItem('topbar', 'Proveedores', 'proveedores', 'dropdown', '/proveedores(/create)?');
		Menus.addSubMenuItem('topbar', 'proveedores', 'Lista de Proveedores', 'proveedores');
		Menus.addSubMenuItem('topbar', 'proveedores', 'Nuevo Proveedor', 'proveedores/create');
		*/
	}
]);