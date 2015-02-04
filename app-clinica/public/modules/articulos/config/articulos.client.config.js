'use strict';

// Configuring the Articles module
angular.module('articulos').run(['Menus',
	function(Menus) {
		// Set top bar menu items
        /*
		Menus.addMenuItem('topbar', 'Articulos', 'articulos', 'dropdown', '/articulos(/create)?');
		Menus.addSubMenuItem('topbar', 'articulos', 'Lista de Articulos', 'articulos');
		Menus.addSubMenuItem('topbar', 'articulos', 'Nuevo Articulo', 'articulos/create');
		*/
	}
]);