'use strict';

// Configuring the Articles module
angular.module('pagos').run(['Menus',
	function(Menus) {
	    Menus.addMenuItem('topbar', 'Pagos', 'pagos', 'item');
    }
]);