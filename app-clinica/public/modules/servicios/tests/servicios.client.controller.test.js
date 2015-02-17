'use strict';

(function() {
	// Servicios Controller Spec
	describe('Servicios Controller Tests', function() {
		// Initialize global variables
		var ServiciosController,
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

			// Initialize the Servicios controller.
			ServiciosController = $controller('ServiciosController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Servicio object fetched from XHR', inject(function(Servicios) {
			// Create sample Servicio using the Servicios service
			var sampleServicio = new Servicios({
				name: 'New Servicio'
			});

			// Create a sample Servicios array that includes the new Servicio
			var sampleServicios = [sampleServicio];

			// Set GET response
			$httpBackend.expectGET('servicios').respond(sampleServicios);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.servicios).toEqualData(sampleServicios);
		}));

		it('$scope.findOne() should create an array with one Servicio object fetched from XHR using a servicioId URL parameter', inject(function(Servicios) {
			// Define a sample Servicio object
			var sampleServicio = new Servicios({
				name: 'New Servicio'
			});

			// Set the URL parameter
			$stateParams.servicioId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/servicios\/([0-9a-fA-F]{24})$/).respond(sampleServicio);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.servicio).toEqualData(sampleServicio);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Servicios) {
			// Create a sample Servicio object
			var sampleServicioPostData = new Servicios({
				name: 'New Servicio'
			});

			// Create a sample Servicio response
			var sampleServicioResponse = new Servicios({
				_id: '525cf20451979dea2c000001',
				name: 'New Servicio'
			});

			// Fixture mock form input values
			scope.name = 'New Servicio';

			// Set POST response
			$httpBackend.expectPOST('servicios', sampleServicioPostData).respond(sampleServicioResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Servicio was created
			expect($location.path()).toBe('/servicios/' + sampleServicioResponse._id);
		}));

		it('$scope.update() should update a valid Servicio', inject(function(Servicios) {
			// Define a sample Servicio put data
			var sampleServicioPutData = new Servicios({
				_id: '525cf20451979dea2c000001',
				name: 'New Servicio'
			});

			// Mock Servicio in scope
			scope.servicio = sampleServicioPutData;

			// Set PUT response
			$httpBackend.expectPUT(/servicios\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/servicios/' + sampleServicioPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid servicioId and remove the Servicio from the scope', inject(function(Servicios) {
			// Create new Servicio object
			var sampleServicio = new Servicios({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Servicios array and include the Servicio
			scope.servicios = [sampleServicio];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/servicios\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleServicio);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.servicios.length).toBe(0);
		}));
	});
}());