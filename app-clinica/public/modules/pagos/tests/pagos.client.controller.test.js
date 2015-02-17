'use strict';

(function() {
	// Pagos Controller Spec
	describe('Pagos Controller Tests', function() {
		// Initialize global variables
		var PagosController,
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

			// Initialize the Pagos controller.
			PagosController = $controller('PagosController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Pago object fetched from XHR', inject(function(Pagos) {
			// Create sample Pago using the Pagos service
			var samplePago = new Pagos({
				name: 'New Pago'
			});

			// Create a sample Pagos array that includes the new Pago
			var samplePagos = [samplePago];

			// Set GET response
			$httpBackend.expectGET('pagos').respond(samplePagos);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.pagos).toEqualData(samplePagos);
		}));

		it('$scope.findOne() should create an array with one Pago object fetched from XHR using a pagoId URL parameter', inject(function(Pagos) {
			// Define a sample Pago object
			var samplePago = new Pagos({
				name: 'New Pago'
			});

			// Set the URL parameter
			$stateParams.pagoId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/pagos\/([0-9a-fA-F]{24})$/).respond(samplePago);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.pago).toEqualData(samplePago);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Pagos) {
			// Create a sample Pago object
			var samplePagoPostData = new Pagos({
				name: 'New Pago'
			});

			// Create a sample Pago response
			var samplePagoResponse = new Pagos({
				_id: '525cf20451979dea2c000001',
				name: 'New Pago'
			});

			// Fixture mock form input values
			scope.name = 'New Pago';

			// Set POST response
			$httpBackend.expectPOST('pagos', samplePagoPostData).respond(samplePagoResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Pago was created
			expect($location.path()).toBe('/pagos/' + samplePagoResponse._id);
		}));

		it('$scope.update() should update a valid Pago', inject(function(Pagos) {
			// Define a sample Pago put data
			var samplePagoPutData = new Pagos({
				_id: '525cf20451979dea2c000001',
				name: 'New Pago'
			});

			// Mock Pago in scope
			scope.pago = samplePagoPutData;

			// Set PUT response
			$httpBackend.expectPUT(/pagos\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/pagos/' + samplePagoPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid pagoId and remove the Pago from the scope', inject(function(Pagos) {
			// Create new Pago object
			var samplePago = new Pagos({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Pagos array and include the Pago
			scope.pagos = [samplePago];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/pagos\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(samplePago);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.pagos.length).toBe(0);
		}));
	});
}());