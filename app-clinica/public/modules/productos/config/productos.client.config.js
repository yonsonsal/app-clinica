'use strict';

// Configuring the Articles module
angular.module('productos').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Productos', 'productos', 'dropdown', '/productos(/create)?');
		Menus.addSubMenuItem('topbar', 'productos', 'Lista de Productos', 'productos');
		Menus.addSubMenuItem('topbar', 'productos', 'Nuevo Producto', 'productos/create');
	}
]);