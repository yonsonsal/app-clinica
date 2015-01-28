'use strict';

(function() {
	// Compras Controller Spec
	describe('Compras Controller Tests', function() {
		// Initialize global variables
		var ComprasController,
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

			// Initialize the Compras controller.
			ComprasController = $controller('ComprasController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Compra object fetched from XHR', inject(function(Compras) {
			// Create sample Compra using the Compras service
			var sampleCompra = new Compras({
				name: 'New Compra'
			});

			// Create a sample Compras array that includes the new Compra
			var sampleCompras = [sampleCompra];

			// Set GET response
			$httpBackend.expectGET('compras').respond(sampleCompras);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.compras).toEqualData(sampleCompras);
		}));

		it('$scope.findOne() should create an array with one Compra object fetched from XHR using a compraId URL parameter', inject(function(Compras) {
			// Define a sample Compra object
			var sampleCompra = new Compras({
				name: 'New Compra'
			});

			// Set the URL parameter
			$stateParams.compraId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/compras\/([0-9a-fA-F]{24})$/).respond(sampleCompra);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.compra).toEqualData(sampleCompra);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Compras) {
			// Create a sample Compra object
			var sampleCompraPostData = new Compras({
				name: 'New Compra'
			});

			// Create a sample Compra response
			var sampleCompraResponse = new Compras({
				_id: '525cf20451979dea2c000001',
				name: 'New Compra'
			});

			// Fixture mock form input values
			scope.name = 'New Compra';

			// Set POST response
			$httpBackend.expectPOST('compras', sampleCompraPostData).respond(sampleCompraResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Compra was created
			expect($location.path()).toBe('/compras/' + sampleCompraResponse._id);
		}));

		it('$scope.update() should update a valid Compra', inject(function(Compras) {
			// Define a sample Compra put data
			var sampleCompraPutData = new Compras({
				_id: '525cf20451979dea2c000001',
				name: 'New Compra'
			});

			// Mock Compra in scope
			scope.compra = sampleCompraPutData;

			// Set PUT response
			$httpBackend.expectPUT(/compras\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/compras/' + sampleCompraPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid compraId and remove the Compra from the scope', inject(function(Compras) {
			// Create new Compra object
			var sampleCompra = new Compras({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Compras array and include the Compra
			scope.compras = [sampleCompra];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/compras\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleCompra);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.compras.length).toBe(0);
		}));
	});
}());