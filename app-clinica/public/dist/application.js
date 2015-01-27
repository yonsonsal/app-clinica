'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function() {
	// Init module configuration options
	var applicationModuleName = 'clinica';
	var applicationModuleVendorDependencies = ['ngResource', 'ngCookies',  'ngAnimate',  'ngTouch',  'ngSanitize',  'ui.router', 'ui.bootstrap', 'ui.utils', 'ui.select'];

	// Add a new vertical module
	var registerModule = function(moduleName, dependencies) {
		// Create angular module
		angular.module(moduleName, dependencies || []);

		// Add the module to the AngularJS configuration file
		angular.module(applicationModuleName).requires.push(moduleName);
	};

	return {
		applicationModuleName: applicationModuleName,
		applicationModuleVendorDependencies: applicationModuleVendorDependencies,
		registerModule: registerModule
	};
})();
'use strict';

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider',
	function($locationProvider) {
		$locationProvider.hashPrefix('!');
	}
]);

//Then define the init function for starting up the application
angular.element(document).ready(function() {
	//Fixing facebook bug with redirect
	if (window.location.hash === '#_=_') window.location.hash = '#!';

	//Then init the app
	angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('articulos');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('compras');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('consumos');
'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('core');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('fabricantes');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('personas');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('productos');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('proveedores');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('tipoproductos');
'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('users');
'use strict';

// Configuring the Articles module
angular.module('articulos').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Articulos', 'articulos', 'dropdown', '/articulos(/create)?');
		Menus.addSubMenuItem('topbar', 'articulos', 'List Articulos', 'articulos');
		Menus.addSubMenuItem('topbar', 'articulos', 'New Articulo', 'articulos/create');
	}
]);
'use strict';

//Setting up route
angular.module('articulos').config(['$stateProvider',
	function($stateProvider) {
		// Articulos state routing
		$stateProvider.
		state('listArticulos', {
			url: '/articulos',
			templateUrl: 'modules/articulos/views/list-articulos.client.view.html'
		}).
		state('createArticulo', {
			url: '/articulos/create',
			templateUrl: 'modules/articulos/views/create-articulo.client.view.html'
		}).
		state('viewArticulo', {
			url: '/articulos/:articuloId',
			templateUrl: 'modules/articulos/views/view-articulo.client.view.html'
		}).
		state('editArticulo', {
			url: '/articulos/:articuloId/edit',
			templateUrl: 'modules/articulos/views/edit-articulo.client.view.html'
		});
	}
]);
'use strict';

// Articulos controller
angular.module('articulos').controller('ArticulosController', ['$scope', '$stateParams', '$location', 'Authentication', 'Articulos',
	function($scope, $stateParams, $location, Authentication, Articulos) {
		$scope.authentication = Authentication;

        $scope.formTitle =  'Nuevo Producto';

        $scope.newTypeProductState = function(){
            $scope.formTitle =  'Nuevo Tipo de Producto';
            $scope.newProductTypeStateBoolean = true;
            $scope.newFabricanteStateBoolean = false;
        };
        $scope.newFabricanteState = function() {
            $scope.formTitle = 'Nuevo Fabricante';
            $scope.newFabricanteStateBoolean = true;
            $scope.newProductTypeStateBoolean = false;
        };
        $scope.newProductState = function() {
            $scope.formTitle = 'Nuevo Producto';
            $scope.newProductTypeStateBoolean = false;
            $scope.newFabricanteStateBoolean = false;
        };
        $scope.newArticuloState = function() {
            $scope.formTitle = 'Nuevo Artículo';
            $scope.newProductTypeStateBoolean = false;
            $scope.newFabricanteStateBoolean = false;
        }
        //tipo de producto
        $scope.tipoproducto = {};
        $scope.tipoProductos = Tipoproductos.query();
        $scope.newFabricanteStateBoolean = false;
        $scope.createTipoProducto = function(){

            // Create new Tipoproducto object
            var tipoproducto = new Tipoproductos ($scope.tipoproducto);
            tipoproducto.$save(function(response) {

                $scope.tipoproducto.selected = response;
                // Clear form fields
                $scope.newProductTypeStateBoolean = false;
                $scope.tipoProductos.push(response);
                $scope.newProductState();
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        //fabricante
        $scope.fabricante = {};
        $scope.fabricantes = Fabricantes.query();

        $scope.newFabricante = function() {

            var fabricante = new Fabricantes($scope.fabricante);
            fabricante.$save(function(response) {
                $scope.fabricante.selected = response;
                $scope.newFabricanteStateBoolean = false;
                $scope.fabricantes.push(response);
                $scope.newProductState();
            }, function (errorResponse){
                $scope.error = errorResponse.data.message;
            });
        };

        $scope.cancel = function() {
            $scope.newProductState();
        };
        $scope.create = function(){

            if ($scope.newProductTypeStateBoolean) {

                $scope.createTipoProducto();
            }else if( $scope.newFabricanteStateBoolean){
                $scope.newFabricante();
            } else {
                $scope.createProducto();
            }
        };
        // Create new Producto
        $scope.producto = {};
        $scope.createProducto = function() {

            // Create new Producto object
            $scope.producto.tipoProducto = $scope.tipoproducto.selected._id;
            $scope.producto.fabricante = $scope.fabricante.selected._id;
            var producto = new Productos ($scope.producto);

            // Redirect after save
            producto.$save(function(response) {
                $location.path('productos/' + response._id);

                // Clear form fields
                $scope.producto = {};
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

		// Create new Articulo
        $scope.articulo = {};
		$scope.create = function() {
			// Create new Articulo object
			var articulo = new Articulos ( $scope.articulo);

			// Redirect after save
			articulo.$save(function(response) {
				$location.path('articulos/' + response._id);

				// Clear form fields
                $scope.articulo = {};
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Articulo
		$scope.remove = function(articulo) {
			if ( articulo ) { 
				articulo.$remove();

				for (var i in $scope.articulos) {
					if ($scope.articulos [i] === articulo) {
						$scope.articulos.splice(i, 1);
					}
				}
			} else {
				$scope.articulo.$remove(function() {
					$location.path('articulos');
				});
			}
		};

		// Update existing Articulo
		$scope.update = function() {
			var articulo = $scope.articulo;

			articulo.$update(function() {
				$location.path('articulos/' + articulo._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Articulos
		$scope.find = function() {
			$scope.articulos = Articulos.query();
		};

		// Find existing Articulo
		$scope.findOne = function() {
			$scope.articulo = Articulos.get({ 
				articuloId: $stateParams.articuloId
			});
		};
	}
]);
'use strict';

//Articulos service used to communicate Articulos REST endpoints
angular.module('articulos').factory('Articulos', ['$resource',
	function($resource) {
		return $resource('articulos/:articuloId', { articuloId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
'use strict';

// Configuring the Articles module
angular.module('compras').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Compras', 'compras', 'dropdown', '/compras(/create)?');
		Menus.addSubMenuItem('topbar', 'compras', 'List Compras', 'compras');
		Menus.addSubMenuItem('topbar', 'compras', 'New Compra', 'compras/create');
	}
]);
'use strict';

//Setting up route
angular.module('compras').config(['$stateProvider',
	function($stateProvider) {
		// Compras state routing
		$stateProvider.
		state('listCompras', {
			url: '/compras',
			templateUrl: 'modules/compras/views/list-compras.client.view.html'
		}).
		state('createCompra', {
			url: '/compras/create',
			templateUrl: 'modules/compras/views/create-compra.client.view.html'
		}).
		state('viewCompra', {
			url: '/compras/:compraId',
			templateUrl: 'modules/compras/views/view-compra.client.view.html'
		}).
		state('editCompra', {
			url: '/compras/:compraId/edit',
			templateUrl: 'modules/compras/views/edit-compra.client.view.html'
		});
	}
]);
'use strict';

// Compras controller
angular.module('compras').controller('ComprasController', ['$scope', '$stateParams', '$location', 'Authentication', 'Compras', 'Articulos',
	function($scope, $stateParams, $location, Authentication, Compras, Articulos {
		$scope.authentication = Authentication;

		// Nueva Compra
        $scope.compra = {}
		$scope.create = function() {
			// Create new Compra object

            //Articulos
            var articulosIds = [];
            angular.forEach($scope.articulos, function(art){

                var articulo = new Articulos(art);
                articulo.$save(function(response) {

                    articulosIds.push(response._id);
                });
            });
            $scope.compra.articulos = articulosIds;

			var compra = new Compras ($scope.compra);

			// Redirect after save
            compra.$save(function(response) {
				$location.path('compras/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

        // Articulos
        $scope.articulos = [];

		// Remove existing Compra
		$scope.remove = function(compra) {
			if ( compra ) { 
				compra.$remove();

				for (var i in $scope.compras) {
					if ($scope.compras [i] === compra) {
						$scope.compras.splice(i, 1);
					}
				}
			} else {
				$scope.compra.$remove(function() {
					$location.path('compras');
				});
			}
		};

		// Update existing Compra
		$scope.update = function() {
			var compra = $scope.compra;

			compra.$update(function() {
				$location.path('compras/' + compra._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Compras
		$scope.find = function() {
			$scope.compras = Compras.query();
		};

		// Find existing Compra
		$scope.findOne = function() {
			$scope.compra = Compras.get({ 
				compraId: $stateParams.compraId
			});
		};
	}
]);
'use strict';

//Compras service used to communicate Compras REST endpoints
angular.module('compras').factory('Compras', ['$resource',
	function($resource) {
		return $resource('compras/:compraId', { compraId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
'use strict';

// Configuring the Articles module
angular.module('consumos').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Consumos', 'consumos', 'dropdown', '/consumos(/create)?');
		Menus.addSubMenuItem('topbar', 'consumos', 'List Consumos', 'consumos');
		Menus.addSubMenuItem('topbar', 'consumos', 'New Consumo', 'consumos/create');
	}
]);
'use strict';

//Setting up route
angular.module('consumos').config(['$stateProvider',
	function($stateProvider) {
		// Consumos state routing
		$stateProvider.
		state('listConsumos', {
			url: '/consumos',
			templateUrl: 'modules/consumos/views/list-consumos.client.view.html'
		}).
		state('createConsumo', {
			url: '/consumos/create',
			templateUrl: 'modules/consumos/views/create-consumo.client.view.html'
		}).
		state('viewConsumo', {
			url: '/consumos/:consumoId',
			templateUrl: 'modules/consumos/views/view-consumo.client.view.html'
		}).
		state('editConsumo', {
			url: '/consumos/:consumoId/edit',
			templateUrl: 'modules/consumos/views/edit-consumo.client.view.html'
		});
	}
]);
'use strict';

// Consumos controller
angular.module('consumos').controller('ConsumosController', ['$scope', '$stateParams', '$location', 'Authentication', 'Consumos',
	function($scope, $stateParams, $location, Authentication, Consumos) {
		$scope.authentication = Authentication;

		// Create new Consumo
		$scope.create = function() {
			// Create new Consumo object
			var consumo = new Consumos ({
				name: this.name
			});

			// Redirect after save
			consumo.$save(function(response) {
				$location.path('consumos/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Consumo
		$scope.remove = function(consumo) {
			if ( consumo ) { 
				consumo.$remove();

				for (var i in $scope.consumos) {
					if ($scope.consumos [i] === consumo) {
						$scope.consumos.splice(i, 1);
					}
				}
			} else {
				$scope.consumo.$remove(function() {
					$location.path('consumos');
				});
			}
		};

		// Update existing Consumo
		$scope.update = function() {
			var consumo = $scope.consumo;

			consumo.$update(function() {
				$location.path('consumos/' + consumo._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Consumos
		$scope.find = function() {
			$scope.consumos = Consumos.query();
		};

		// Find existing Consumo
		$scope.findOne = function() {
			$scope.consumo = Consumos.get({ 
				consumoId: $stateParams.consumoId
			});
		};
	}
]);
'use strict';

//Consumos service used to communicate Consumos REST endpoints
angular.module('consumos').factory('Consumos', ['$resource',
	function($resource) {
		return $resource('consumos/:consumoId', { consumoId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		// Redirect to home view when route not found
		$urlRouterProvider.otherwise('/');

		// Home state routing
		$stateProvider.
		state('home', {
			url: '/',
			templateUrl: 'modules/core/views/home.client.view.html'
		});
	}
]);
'use strict';

angular.module('core').controller('HeaderController', ['$scope', 'Authentication', 'Menus',
	function($scope, Authentication, Menus) {
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');

		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isCollapsed = false;
		});
	}
]);
'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication',
	function($scope, Authentication) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
	}
])

    .directive('commonUtilities', ['$timeout', function ($timeout){
        return {
            restrict: 'A',
            link: function () {
                $timeout(function() {
                    $('.fa-bars').click(function () {
                        if ($('#sidebar > ul').is(":visible") === true) {
                            $('#main-content').css({
                                'margin-left': '0px'
                            });
                            $('#sidebar').css({
                                'margin-left': '-210px'
                            });
                            $('#sidebar > ul').hide();
                            $("#container").addClass("sidebar-closed");
                        } else {
                            $('#main-content').css({
                                'margin-left': '210px'
                            });
                            $('#sidebar > ul').show();
                            $('#sidebar').css({
                                'margin-left': '0'
                            });
                            $("#container").removeClass("sidebar-closed");
                        }
                    });

                    $(function() {
                        function responsiveView() {
                            var wSize = $(window).width();
                            if (wSize <= 768) {
                                $('#container').addClass('sidebar-close');
                                $('#sidebar > ul').hide();
                            }

                            if (wSize > 768) {
                                $('#container').removeClass('sidebar-close');
                                $('#sidebar > ul').show();
                            }
                        }
                        $(window).on('load', responsiveView);
                        $(window).on('resize', responsiveView);
                    });

                    jQuery('#sidebar .sub-menu > a').click(function () {
                        var o = ($(this).offset());
                        var diff = 250 - o.top;
                        if(diff>0)
                            $("#sidebar").scrollTo("-="+Math.abs(diff),500);
                        else
                            $("#sidebar").scrollTo("+="+Math.abs(diff),500);
                    });

                    $(function() {
                        $('#nav-accordion').dcAccordion({
                            eventType: 'click',
                            autoClose: true,
                            saveState: true,
                            disableLink: true,
                            speed: 'slow',
                            showCount: false,
                            autoExpand: true,
                            classExpand: 'dcjq-current-parent'
                        });
                    });
                });

            }
        }
    }])
;


'use strict';

//Menu service used for managing  menus
angular.module('core').service('Menus', [

	function() {
		// Define a set of default roles
		this.defaultRoles = ['*'];

		// Define the menus object
		this.menus = {};

		// A private function for rendering decision 
		var shouldRender = function(user) {
			if (user) {
				if (!!~this.roles.indexOf('*')) {
					return true;
				} else {
					for (var userRoleIndex in user.roles) {
						for (var roleIndex in this.roles) {
							if (this.roles[roleIndex] === user.roles[userRoleIndex]) {
								return true;
							}
						}
					}
				}
			} else {
				return this.isPublic;
			}

			return false;
		};

		// Validate menu existance
		this.validateMenuExistance = function(menuId) {
			if (menuId && menuId.length) {
				if (this.menus[menuId]) {
					return true;
				} else {
					throw new Error('Menu does not exists');
				}
			} else {
				throw new Error('MenuId was not provided');
			}

			return false;
		};

		// Get the menu object by menu id
		this.getMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			return this.menus[menuId];
		};

		// Add new menu object by menu id
		this.addMenu = function(menuId, isPublic, roles) {
			// Create the new menu
			this.menus[menuId] = {
				isPublic: isPublic || false,
				roles: roles || this.defaultRoles,
				items: [],
				shouldRender: shouldRender
			};

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			delete this.menus[menuId];
		};

		// Add menu item object
		this.addMenuItem = function(menuId, menuItemTitle, menuItemURL, menuItemType, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Push new menu item
			this.menus[menuId].items.push({
				title: menuItemTitle,
				link: menuItemURL,
				menuItemType: menuItemType || 'item',
				menuItemClass: menuItemType,
				uiRoute: menuItemUIRoute || ('/' + menuItemURL),
				isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].isPublic : isPublic),
				roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].roles : roles),
				position: position || 0,
				items: [],
				shouldRender: shouldRender
			});

			// Return the menu object
			return this.menus[menuId];
		};

		// Add submenu item object
		this.addSubMenuItem = function(menuId, rootMenuItemURL, menuItemTitle, menuItemURL, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === rootMenuItemURL) {
					// Push new submenu item
					this.menus[menuId].items[itemIndex].items.push({
						title: menuItemTitle,
						link: menuItemURL,
						uiRoute: menuItemUIRoute || ('/' + menuItemURL),
						isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].items[itemIndex].isPublic : isPublic),
						roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].items[itemIndex].roles : roles),
						position: position || 0,
						shouldRender: shouldRender
					});
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenuItem = function(menuId, menuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === menuItemURL) {
					this.menus[menuId].items.splice(itemIndex, 1);
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeSubMenuItem = function(menuId, submenuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				for (var subitemIndex in this.menus[menuId].items[itemIndex].items) {
					if (this.menus[menuId].items[itemIndex].items[subitemIndex].link === submenuItemURL) {
						this.menus[menuId].items[itemIndex].items.splice(subitemIndex, 1);
					}
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		//Adding the topbar menu
		this.addMenu('topbar');
	}
]);
'use strict';

// Configuring the Articles module
angular.module('fabricantes').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Fabricantes', 'fabricantes', 'dropdown', '/fabricantes(/create)?');
		Menus.addSubMenuItem('topbar', 'fabricantes', 'Lista de Fabricantes', 'fabricantes');
		Menus.addSubMenuItem('topbar', 'fabricantes', 'Nuevo Fabricante', 'fabricantes/create');
	}
]);
'use strict';

//Setting up route
angular.module('fabricantes').config(['$stateProvider',
	function($stateProvider) {
		// Fabricantes state routing
		$stateProvider.
		state('listFabricantes', {
			url: '/fabricantes',
			templateUrl: 'modules/fabricantes/views/list-fabricantes.client.view.html'
		}).
		state('createFabricante', {
			url: '/fabricantes/create',
			templateUrl: 'modules/fabricantes/views/create-fabricante.client.view.html'
		}).
		state('viewFabricante', {
			url: '/fabricantes/:fabricanteId',
			templateUrl: 'modules/fabricantes/views/view-fabricante.client.view.html'
		}).
		state('editFabricante', {
			url: '/fabricantes/:fabricanteId/edit',
			templateUrl: 'modules/fabricantes/views/edit-fabricante.client.view.html'
		});
	}
]);
'use strict';

// Fabricantes controller
angular.module('fabricantes').controller('FabricantesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Fabricantes',
	function($scope, $stateParams, $location, Authentication, Fabricantes) {
		$scope.authentication = Authentication;

		// Create new Fabricante
        $scope.fabricante = {};
		$scope.create = function() {
			// Create new Fabricante object
			var fabricante = new Fabricantes ($scope.fabricante);

			// Redirect after save
			fabricante.$save(function(response) {
				$location.path('fabricantes/' + response._id);

				// Clear form fields
                $scope.fabricante = {};
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Fabricante
		$scope.remove = function(fabricante) {
			if ( fabricante ) { 
				fabricante.$remove();

				for (var i in $scope.fabricantes) {
					if ($scope.fabricantes [i] === fabricante) {
						$scope.fabricantes.splice(i, 1);
					}
				}
			} else {
				$scope.fabricante.$remove(function() {
					$location.path('fabricantes');
				});
			}
		};

		// Update existing Fabricante
		$scope.update = function() {
			var fabricante = $scope.fabricante;

			fabricante.$update(function() {
				$location.path('fabricantes/' + fabricante._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Fabricantes
		$scope.find = function() {
			$scope.fabricantes = Fabricantes.query();
		};

		// Find existing Fabricante
		$scope.findOne = function() {
			$scope.fabricante = Fabricantes.get({ 
				fabricanteId: $stateParams.fabricanteId
			});
		};
	}
]);
'use strict';

//Fabricantes service used to communicate Fabricantes REST endpoints
angular.module('fabricantes').factory('Fabricantes', ['$resource',
	function($resource) {
		return $resource('fabricantes/:fabricanteId', { fabricanteId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
'use strict';

// Configuring the Articles module
angular.module('personas').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Personas', 'personas', 'dropdown', '/personas(/create)?');
		Menus.addSubMenuItem('topbar', 'personas', 'List Personas', 'personas');
		Menus.addSubMenuItem('topbar', 'personas', 'New Persona', 'personas/create');
	}
]);
'use strict';

//Setting up route
angular.module('personas').config(['$stateProvider',
	function($stateProvider) {
		// Personas state routing
		$stateProvider.
		state('listPersonas', {
			url: '/personas',
			templateUrl: 'modules/personas/views/list-personas.client.view.html'
		}).
		state('createPersona', {
			url: '/personas/create',
			templateUrl: 'modules/personas/views/create-persona.client.view.html'
		}).
		state('viewPersona', {
			url: '/personas/:personaId',
			templateUrl: 'modules/personas/views/view-persona.client.view.html'
		}).
		state('editPersona', {
			url: '/personas/:personaId/edit',
			templateUrl: 'modules/personas/views/edit-persona.client.view.html'
		});
	}
]);
'use strict';

// Personas controller
angular.module('personas').controller('PersonasController', ['$scope', '$stateParams', '$location', 'Authentication', 'Personas',
	function($scope, $stateParams, $location, Authentication, Personas) {
		$scope.authentication = Authentication;

		// Create new Persona
        $scope.persona = {};
		$scope.create = function() {
			// Create new Persona object
			var persona = new Personas ($scope.persona);

			// Redirect after save
			persona.$save(function(response) {
				$location.path('personas/' + response._id);

				// Clear form fields
                $scope.persona = {};
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Persona
		$scope.remove = function(persona) {
			if ( persona ) { 
				persona.$remove();

				for (var i in $scope.personas) {
					if ($scope.personas [i] === persona) {
						$scope.personas.splice(i, 1);
					}
				}
			} else {
				$scope.persona.$remove(function() {
					$location.path('personas');
				});
			}
		};

		// Update existing Persona
		$scope.update = function() {
			var persona = $scope.persona;

			persona.$update(function() {
				$location.path('personas/' + persona._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Personas
		$scope.find = function() {
			$scope.personas = Personas.query();
		};

		// Find existing Persona
		$scope.findOne = function() {
			$scope.persona = Personas.get({ 
				personaId: $stateParams.personaId
			});
		};
	}
]);
'use strict';

//Personas service used to communicate Personas REST endpoints
angular.module('personas').factory('Personas', ['$resource',
	function($resource) {
		return $resource('personas/:personaId', { personaId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
'use strict';

// Configuring the Articles module
angular.module('productos').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Productos', 'productos', 'dropdown', '/productos(/create)?');
		Menus.addSubMenuItem('topbar', 'productos', 'List Productos', 'productos');
		Menus.addSubMenuItem('topbar', 'productos', 'New Producto', 'productos/create');
	}
]);
'use strict';

//Setting up route
angular.module('productos').config(['$stateProvider',
	function($stateProvider) {
		// Productos state routing
		$stateProvider.
		state('listProductos', {
			url: '/productos',
			templateUrl: 'modules/productos/views/list-productos.client.view.html'
		}).
		state('createProducto', {
			url: '/productos/create',
			templateUrl: 'modules/productos/views/create-producto.client.view.html'
		}).
		state('viewProducto', {
			url: '/productos/:productoId',
			templateUrl: 'modules/productos/views/view-producto.client.view.html'
		}).
		state('editProducto', {
			url: '/productos/:productoId/edit',
			templateUrl: 'modules/productos/views/edit-producto.client.view.html'
		});
	}
]);
'use strict';

// Productos controller
angular.module('productos').controller('ProductosController', ['$scope', '$stateParams', '$location', 'Authentication', 'Productos', 'Tipoproductos', 'Fabricantes',
	function($scope, $stateParams, $location, Authentication, Productos, Tipoproductos, Fabricantes) {
		$scope.authentication = Authentication;


        $scope.formTitle =  'Nuevo Producto';

        $scope.newTypeProductState = function(){
            $scope.formTitle =  'Nuevo Tipo de Producto';
            $scope.newProductTypeStateBoolean = true;
            $scope.newFabricanteStateBoolean = false;
        };
        $scope.newFabricanteState = function() {
            $scope.formTitle = 'Nuevo Fabricante';
            $scope.newFabricanteStateBoolean = true;
            $scope.newProductTypeStateBoolean = false;
        };
        $scope.newProductState = function() {
            $scope.formTitle = 'Nuevo Producto';
            $scope.newProductTypeStateBoolean = false;
            $scope.newFabricanteStateBoolean = false;
        };
        //tipo de producto
        $scope.tipoproducto = {};
        $scope.tipoProductos = Tipoproductos.query();
        $scope.newFabricanteStateBoolean = false;
        $scope.createTipoProducto = function(){

            // Create new Tipoproducto object
            var tipoproducto = new Tipoproductos ($scope.tipoproducto);
            tipoproducto.$save(function(response) {

                $scope.tipoproducto.selected = response;
                // Clear form fields
                $scope.newProductTypeStateBoolean = false;
                $scope.tipoProductos.push(response);
                $scope.newProductState();
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        //fabricante
        $scope.fabricante = {};
        $scope.fabricantes = Fabricantes.query();

        $scope.newFabricante = function() {

            var fabricante = new Fabricantes($scope.fabricante);
                fabricante.$save(function(response) {
                $scope.fabricante.selected = response;
                $scope.newFabricanteStateBoolean = false;
                $scope.fabricantes.push(response);
                $scope.newProductState();
            }, function (errorResponse){
                $scope.error = errorResponse.data.message;
            });
        };

        $scope.cancel = function() {
            $scope.newProductState();
        };
        $scope.create = function(){

            if ($scope.newProductTypeStateBoolean) {

                $scope.createTipoProducto();
            }else if( $scope.newFabricanteStateBoolean){
                $scope.newFabricante();
            } else {
                $scope.createProducto();
            }
        };
		// Create new Producto
        $scope.producto = {};
		$scope.createProducto = function() {

			// Create new Producto object
            $scope.producto.tipoProducto = $scope.tipoproducto.selected._id;
            $scope.producto.fabricante = $scope.fabricante.selected._id;
			var producto = new Productos ($scope.producto);

			// Redirect after save
			producto.$save(function(response) {
				$location.path('productos/' + response._id);

				// Clear form fields
                $scope.producto = {};
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Producto
		$scope.remove = function(producto) {
			if ( producto ) { 
				producto.$remove();

				for (var i in $scope.productos) {
					if ($scope.productos [i] === producto) {
						$scope.productos.splice(i, 1);
					}
				}
			} else {
				$scope.producto.$remove(function() {
					$location.path('productos');
				});
			}
		};

		// Update existing Producto
		$scope.update = function() {
			var producto = $scope.producto;

			producto.$update(function() {
				$location.path('productos/' + producto._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Productos
		$scope.find = function() {
			$scope.productos = Productos.query();
		};

		// Find existing Producto
		$scope.findOne = function() {
			$scope.producto = Productos.get({ 
				productoId: $stateParams.productoId
			});
		};
	}
]);
/*
angular.module('producto')
    .service('producto',  ['Productos', 'Tipoproductos', 'Fabricantes',
        function ( Productos, Tipoproductos, Fabricantes) {


}]);
*/



'use strict';

//Productos service used to communicate Productos REST endpoints
angular.module('productos').factory('Productos', ['$resource',
	function($resource) {
		return $resource('productos/:productoId', { productoId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
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
'use strict';

//Setting up route
angular.module('proveedores').config(['$stateProvider',
	function($stateProvider) {
		// Proveedores state routing
		$stateProvider.
		state('listProveedores', {
			url: '/proveedores',
			templateUrl: 'modules/proveedores/views/list-proveedores.client.view.html'
		}).
		state('createProveedore', {
			url: '/proveedores/create',
			templateUrl: 'modules/proveedores/views/create-proveedore.client.view.html'
		}).
		state('viewProveedore', {
			url: '/proveedores/:proveedoreId',
			templateUrl: 'modules/proveedores/views/view-proveedore.client.view.html'
		}).
		state('editProveedore', {
			url: '/proveedores/:proveedoreId/edit',
			templateUrl: 'modules/proveedores/views/edit-proveedore.client.view.html'
		});
	}
]);
'use strict';

// Proveedores controller
angular.module('proveedores').controller('ProveedoresController', ['$scope', '$stateParams', '$location', 'Authentication', 'Proveedores',
	function($scope, $stateParams, $location, Authentication, Proveedores) {
		$scope.authentication = Authentication;

		// Create new Proveedore
        $scope.proveedor = {};

		$scope.create = function() {
			// Create new Proveedore object

			var proveedore = new Proveedores ($scope.proveedor);

			// Redirect after save
			proveedore.$save(function(response) {
				$location.path('proveedores/' + response._id);

				// Clear form fields
              //  $scope.proveedor = {};
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Proveedore
		$scope.remove = function(proveedore) {
			if ( proveedore ) { 
				proveedore.$remove();

				for (var i in $scope.proveedores) {
					if ($scope.proveedores [i] === proveedore) {
						$scope.proveedores.splice(i, 1);
					}
				}
			} else {
				$scope.proveedor.$remove(function() {
					$location.path('proveedores');
				});
			}
		};

		// Update existing Proveedore
		$scope.update = function() {
			var proveedore = $scope.proveedor;

			proveedore.$update(function() {
				$location.path('proveedores/' + proveedore._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Proveedores
		$scope.find = function() {
			$scope.proveedores = Proveedores.query();
		};

		// Find existing Proveedore
		$scope.findOne = function() {
			$scope.proveedor = Proveedores.get({
				proveedoreId: $stateParams.proveedoreId
			});
		};
	}
]);
'use strict';

//Proveedores service used to communicate Proveedores REST endpoints
angular.module('proveedores').factory('Proveedores', ['$resource',
	function($resource) {
		return $resource('proveedores/:proveedoreId', { proveedoreId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
'use strict';

//Setting up route
angular.module('tipoproductos').config(['$stateProvider',
	function($stateProvider) {
		// Tipoproductos state routing
		$stateProvider.
		state('listTipoproductos', {
			url: '/tipoproductos',
			templateUrl: 'modules/tipoproductos/views/list-tipoproductos.client.view.html'
		}).
		state('createTipoproducto', {
			url: '/tipoproductos/create',
			templateUrl: 'modules/tipoproductos/views/create-tipoproducto.client.view.html'
		}).
		state('viewTipoproducto', {
			url: '/tipoproductos/:tipoproductoId',
			templateUrl: 'modules/tipoproductos/views/view-tipoproducto.client.view.html'
		}).
		state('editTipoproducto', {
			url: '/tipoproductos/:tipoproductoId/edit',
			templateUrl: 'modules/tipoproductos/views/edit-tipoproducto.client.view.html'
		});
	}
]);
'use strict';

// Tipoproductos controller
angular.module('tipoproductos').controller('TipoproductosController', ['$scope', '$stateParams', '$location', 'Authentication', 'Tipoproductos',
	function($scope, $stateParams, $location, Authentication, Tipoproductos) {
		$scope.authentication = Authentication;

        $scope.tipoproducto = {};
		// Create new Tipoproducto
		$scope.create = function() {
			// Create new Tipoproducto object
			var tipoproducto = new Tipoproductos ($scope.tipoproducto);

			// Redirect after save
			tipoproducto.$save(function(response) {
				$location.path('tipoproductos/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Tipoproducto
		$scope.remove = function(tipoproducto) {
			if ( tipoproducto ) { 
				tipoproducto.$remove();

				for (var i in $scope.tipoproductos) {
					if ($scope.tipoproductos [i] === tipoproducto) {
						$scope.tipoproductos.splice(i, 1);
					}
				}
			} else {
				$scope.tipoproducto.$remove(function() {
					$location.path('tipoproductos');
				});
			}
		};

		// Update existing Tipoproducto
		$scope.update = function() {
			var tipoproducto = $scope.tipoproducto;

			tipoproducto.$update(function() {
				$location.path('tipoproductos/' + tipoproducto._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Tipoproductos
		$scope.find = function() {
			$scope.tipoproductos = Tipoproductos.query();
		};

		// Find existing Tipoproducto
		$scope.findOne = function() {
			$scope.tipoproducto = Tipoproductos.get({ 
				tipoproductoId: $stateParams.tipoproductoId
			});
		};
	}
]);
'use strict';

//Tipoproductos service used to communicate Tipoproductos REST endpoints
angular.module('tipoproductos').factory('Tipoproductos', ['$resource',
	function($resource) {
		return $resource('tipoproductos/:tipoproductoId', { tipoproductoId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
'use strict';

// Config HTTP Error Handling
angular.module('users').config(['$httpProvider',
	function($httpProvider) {
		// Set the httpProvider "not authorized" interceptor
		$httpProvider.interceptors.push(['$q', '$location', 'Authentication',
			function($q, $location, Authentication) {
				return {
					responseError: function(rejection) {
						switch (rejection.status) {
							case 401:
								// Deauthenticate the global user
								Authentication.user = null;

								// Redirect to signin page
								$location.path('signin');
								break;
							case 403:
								// Add unauthorized behaviour 
								break;
						}

						return $q.reject(rejection);
					}
				};
			}
		]);
	}
]);
'use strict';

// Setting up route
angular.module('users').config(['$stateProvider',
	function($stateProvider) {
		// Users state routing
		$stateProvider.
		state('profile', {
			url: '/settings/profile',
			templateUrl: 'modules/users/views/settings/edit-profile.client.view.html'
		}).
		state('password', {
			url: '/settings/password',
			templateUrl: 'modules/users/views/settings/change-password.client.view.html'
		}).
		state('accounts', {
			url: '/settings/accounts',
			templateUrl: 'modules/users/views/settings/social-accounts.client.view.html'
		}).
		state('signup', {
			url: '/signup',
			templateUrl: 'modules/users/views/authentication/signup.client.view.html'
		}).
		state('signin', {
			url: '/signin',
			templateUrl: 'modules/users/views/authentication/signin.client.view.html'
		}).
		state('forgot', {
			url: '/password/forgot',
			templateUrl: 'modules/users/views/password/forgot-password.client.view.html'
		}).
		state('reset-invalid', {
			url: '/password/reset/invalid',
			templateUrl: 'modules/users/views/password/reset-password-invalid.client.view.html'
		}).
		state('reset-success', {
			url: '/password/reset/success',
			templateUrl: 'modules/users/views/password/reset-password-success.client.view.html'
		}).
		state('reset', {
			url: '/password/reset/:token',
			templateUrl: 'modules/users/views/password/reset-password.client.view.html'
		});
	}
]);
'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$http', '$location', 'Authentication',
	function($scope, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		// If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		$scope.signup = function() {
			$http.post('/auth/signup', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		$scope.signin = function() {
			$http.post('/auth/signin', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

angular.module('users').controller('PasswordController', ['$scope', '$stateParams', '$http', '$location', 'Authentication',
	function($scope, $stateParams, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		//If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		// Submit forgotten password account id
		$scope.askForPasswordReset = function() {
			$scope.success = $scope.error = null;

			$http.post('/auth/forgot', $scope.credentials).success(function(response) {
				// Show user success message and clear form
				$scope.credentials = null;
				$scope.success = response.message;

			}).error(function(response) {
				// Show user error message and clear form
				$scope.credentials = null;
				$scope.error = response.message;
			});
		};

		// Change user password
		$scope.resetUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/auth/reset/' + $stateParams.token, $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.passwordDetails = null;

				// Attach user profile
				Authentication.user = response;

				// And redirect to the index page
				$location.path('/password/reset/success');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

angular.module('users').controller('SettingsController', ['$scope', '$http', '$location', 'Users', 'Authentication',
	function($scope, $http, $location, Users, Authentication) {
		$scope.user = Authentication.user;

		// If user is not signed in then redirect back home
		if (!$scope.user) $location.path('/');

		// Check if there are additional accounts 
		$scope.hasConnectedAdditionalSocialAccounts = function(provider) {
			for (var i in $scope.user.additionalProvidersData) {
				return true;
			}

			return false;
		};

		// Check if provider is already in use with current user
		$scope.isConnectedSocialAccount = function(provider) {
			return $scope.user.provider === provider || ($scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider]);
		};

		// Remove a user social account
		$scope.removeUserSocialAccount = function(provider) {
			$scope.success = $scope.error = null;

			$http.delete('/users/accounts', {
				params: {
					provider: provider
				}
			}).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.user = Authentication.user = response;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		// Update a user profile
		$scope.updateUserProfile = function(isValid) {
			if (isValid) {
				$scope.success = $scope.error = null;
				var user = new Users($scope.user);

				user.$update(function(response) {
					$scope.success = true;
					Authentication.user = response;
				}, function(response) {
					$scope.error = response.data.message;
				});
			} else {
				$scope.submitted = true;
			}
		};

		// Change user password
		$scope.changeUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/users/password', $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.passwordDetails = null;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

// Authentication service for user variables
angular.module('users').factory('Authentication', [
	function() {
		var _this = this;

		_this._data = {
			user: window.user
		};

		return _this._data;
	}
]);
'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', ['$resource',
	function($resource) {
		return $resource('users', {}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);