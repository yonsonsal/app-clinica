'use strict';

(function() {
	// Consumos Controller Spec
	describe('Consumos Controller Tests', function() {
		// Initialize global variables
		var ConsumosController,
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

			// Initialize the Consumos controller.
			ConsumosController = $controller('ConsumosController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Consumo object fetched from XHR', inject(function(Consumos) {
			// Create sample Consumo using the Consumos service
			var sampleConsumo = new Consumos({
				name: 'New Consumo'
			});

			// Create a sample Consumos array that includes the new Consumo
			var sampleConsumos = [sampleConsumo];

			// Set GET response
			$httpBackend.expectGET('consumos').respond(sampleConsumos);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.consumos).toEqualData(sampleConsumos);
		}));

		it('$scope.findOne() should create an array with one Consumo object fetched from XHR using a consumoId URL parameter', inject(function(Consumos) {
			// Define a sample Consumo object
			var sampleConsumo = new Consumos({
				name: 'New Consumo'
			});

			// Set the URL parameter
			$stateParams.consumoId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/consumos\/([0-9a-fA-F]{24})$/).respond(sampleConsumo);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.consumo).toEqualData(sampleConsumo);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Consumos) {
			// Create a sample Consumo object
			var sampleConsumoPostData = new Consumos({
				name: 'New Consumo'
			});

			// Create a sample Consumo response
			var sampleConsumoResponse = new Consumos({
				_id: '525cf20451979dea2c000001',
				name: 'New Consumo'
			});

			// Fixture mock form input values
			scope.name = 'New Consumo';

			// Set POST response
			$httpBackend.expectPOST('consumos', sampleConsumoPostData).respond(sampleConsumoResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Consumo was created
			expect($location.path()).toBe('/consumos/' + sampleConsumoResponse._id);
		}));

		it('$scope.update() should update a valid Consumo', inject(function(Consumos) {
			// Define a sample Consumo put data
			var sampleConsumoPutData = new Consumos({
				_id: '525cf20451979dea2c000001',
				name: 'New Consumo'
			});

			// Mock Consumo in scope
			scope.consumo = sampleConsumoPutData;

			// Set PUT response
			$httpBackend.expectPUT(/consumos\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/consumos/' + sampleConsumoPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid consumoId and remove the Consumo from the scope', inject(function(Consumos) {
			// Create new Consumo object
			var sampleConsumo = new Consumos({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Consumos array and include the Consumo
			scope.consumos = [sampleConsumo];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/consumos\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleConsumo);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.consumos.length).toBe(0);
		}));
	});
}());