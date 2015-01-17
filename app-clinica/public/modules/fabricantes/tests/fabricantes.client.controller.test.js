'use strict';

(function() {
	// Fabricantes Controller Spec
	describe('Fabricantes Controller Tests', function() {
		// Initialize global variables
		var FabricantesController,
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

			// Initialize the Fabricantes controller.
			FabricantesController = $controller('FabricantesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Fabricante object fetched from XHR', inject(function(Fabricantes) {
			// Create sample Fabricante using the Fabricantes service
			var sampleFabricante = new Fabricantes({
				name: 'New Fabricante'
			});

			// Create a sample Fabricantes array that includes the new Fabricante
			var sampleFabricantes = [sampleFabricante];

			// Set GET response
			$httpBackend.expectGET('fabricantes').respond(sampleFabricantes);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.fabricantes).toEqualData(sampleFabricantes);
		}));

		it('$scope.findOne() should create an array with one Fabricante object fetched from XHR using a fabricanteId URL parameter', inject(function(Fabricantes) {
			// Define a sample Fabricante object
			var sampleFabricante = new Fabricantes({
				name: 'New Fabricante'
			});

			// Set the URL parameter
			$stateParams.fabricanteId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/fabricantes\/([0-9a-fA-F]{24})$/).respond(sampleFabricante);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.fabricante).toEqualData(sampleFabricante);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Fabricantes) {
			// Create a sample Fabricante object
			var sampleFabricantePostData = new Fabricantes({
				name: 'New Fabricante'
			});

			// Create a sample Fabricante response
			var sampleFabricanteResponse = new Fabricantes({
				_id: '525cf20451979dea2c000001',
				name: 'New Fabricante'
			});

			// Fixture mock form input values
			scope.name = 'New Fabricante';

			// Set POST response
			$httpBackend.expectPOST('fabricantes', sampleFabricantePostData).respond(sampleFabricanteResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Fabricante was created
			expect($location.path()).toBe('/fabricantes/' + sampleFabricanteResponse._id);
		}));

		it('$scope.update() should update a valid Fabricante', inject(function(Fabricantes) {
			// Define a sample Fabricante put data
			var sampleFabricantePutData = new Fabricantes({
				_id: '525cf20451979dea2c000001',
				name: 'New Fabricante'
			});

			// Mock Fabricante in scope
			scope.fabricante = sampleFabricantePutData;

			// Set PUT response
			$httpBackend.expectPUT(/fabricantes\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/fabricantes/' + sampleFabricantePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid fabricanteId and remove the Fabricante from the scope', inject(function(Fabricantes) {
			// Create new Fabricante object
			var sampleFabricante = new Fabricantes({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Fabricantes array and include the Fabricante
			scope.fabricantes = [sampleFabricante];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/fabricantes\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleFabricante);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.fabricantes.length).toBe(0);
		}));
	});
}());