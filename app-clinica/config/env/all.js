'use strict';

module.exports = {
	app: {
		title: 'Clinica',
		description: 'Administracion de Insumos, control de Stock.',
		keywords: 'MongoDB, Express, AngularJS, Node.js'
	},
	port: process.env.PORT || 3000,
	templateEngine: 'swig',
	sessionSecret: 'MEAN',
	sessionCollection: 'sessions',
	assets: {
		lib: {
			css: [
				'public/lib/bootstrap/dist/css/bootstrap.css',
				'public/lib/bootstrap/dist/css/bootstrap-theme.css',
                'public/lib/angular-ui-select/dist/select.css',
                'public/assets/theme/css/style.css',
                'public/assets/theme/css/style-responsive.css',
                'public/assets/theme/css/table-responsive.css',
                'public/assets/theme/css/to-do.css',
                'public/assets/theme/font-awesome/css/font-awesome.css'
			],
			js: [
				'public/lib/angular/angular.js',
				'public/lib/angular-resource/angular-resource.js', 
				'public/lib/angular-cookies/angular-cookies.js', 
				'public/lib/angular-animate/angular-animate.js', 
				'public/lib/angular-touch/angular-touch.js', 
				'public/lib/angular-sanitize/angular-sanitize.js', 
				'public/lib/angular-ui-router/release/angular-ui-router.js',
				'public/lib/angular-ui-utils/ui-utils.js',
				'public/lib/angular-bootstrap/ui-bootstrap-tpls.js',
                'public/lib/angular-ui-select/dist/select.js',
                'public/lib/jquery/dist/jquery.js',
                'public/lib/bootstrap/dist/js/bootstrap.js',
                'public/assets/theme/js/jquery-ui-1.9.2.custom.min.js',
                'public/assets/theme/js/jquery.ui.touch-punch.min.js',
                'public/assets/theme/js/jquery.dcjqaccordion.2.7.js',
                'public/assets/theme/js/jquery.scrollTo.min.js',
                'public/assets/theme/js/jquery.nicescroll.js',
                'public/assets/theme/js/common-scripts.js',
                'public/assets/theme/js/bootstrap-switch.js',
                'public/assets/theme/js/form-component.js'
			]
		},
		css: [
			'public/modules/**/css/*.css'
		],
		js: [
			'public/config.js',
			'public/application.js',
			'public/modules/*/*.js',
			'public/modules/*/*[!tests]*/*.js'
		],
		tests: [
			'public/lib/angular-mocks/angular-mocks.js',
			'public/modules/*/tests/*.js'
		]
	}
};