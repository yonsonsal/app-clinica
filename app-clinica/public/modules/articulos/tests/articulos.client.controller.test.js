'use strict';

(function() {
	// Articulos Controller Spec
	describe('Articulos Controller Tests', function() {
		// Initialize global variables
		var ArticulosController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Articulos controller.
			ArticulosController = $controller('ArticulosController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Articulo object fetched from XHR', inject(function(Articulos) {
			// Create sample Articulo using the Articulos service
			var sampleArticulo = new Articulos({
				name: 'New Articulo'
			});

			// Create a sample Articulos array that includes the new Articulo
			var sampleArticulos = [sampleArticulo];

			// Set GET response
			$httpBackend.expectGET('articulos').respond(sampleArticulos);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.articulos).toEqualData(sampleArticulos);
		}));

		it('$scope.findOne() should create an array with one Articulo object fetched from XHR using a articuloId URL parameter', inject(function(Articulos) {
			// Define a sample Articulo object
			var sampleArticulo = new Articulos({
				name: 'New Articulo'
			});

			// Set the URL parameter
			$stateParams.articuloId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/articulos\/([0-9a-fA-F]{24})$/).respond(sampleArticulo);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.articulo).toEqualData(sampleArticulo);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Articulos) {
			// Create a sample Articulo object
			var sampleArticuloPostData = new Articulos({
				name: 'New Articulo'
			});

			// Create a sample Articulo response
			var sampleArticuloResponse = new Articulos({
				_id: '525cf20451979dea2c000001',
				name: 'New Articulo'
			});

			// Fixture mock form input values
			scope.name = 'New Articulo';

			// Set POST response
			$httpBackend.expectPOST('articulos', sampleArticuloPostData).respond(sampleArticuloResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Articulo was created
			expect($location.path()).toBe('/articulos/' + sampleArticuloResponse._id);
		}));

		it('$scope.update() should update a valid Articulo', inject(function(Articulos) {
			// Define a sample Articulo put data
			var sampleArticuloPutData = new Articulos({
				_id: '525cf20451979dea2c000001',
				name: 'New Articulo'
			});

			// Mock Articulo in scope
			scope.articulo = sampleArticuloPutData;

			// Set PUT response
			$httpBackend.expectPUT(/articulos\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/articulos/' + sampleArticuloPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid articuloId and remove the Articulo from the scope', inject(function(Articulos) {
			// Create new Articulo object
			var sampleArticulo = new Articulos({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Articulos array and include the Articulo
			scope.articulos = [sampleArticulo];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/articulos\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleArticulo);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.articulos.length).toBe(0);
		}));
	});
}());