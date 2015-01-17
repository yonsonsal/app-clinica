'use strict';

(function() {
	// Proveedores Controller Spec
	describe('Proveedores Controller Tests', function() {
		// Initialize global variables
		var ProveedoresController,
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

			// Initialize the Proveedores controller.
			ProveedoresController = $controller('ProveedoresController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Proveedore object fetched from XHR', inject(function(Proveedores) {
			// Create sample Proveedore using the Proveedores service
			var sampleProveedore = new Proveedores({
				name: 'New Proveedore'
			});

			// Create a sample Proveedores array that includes the new Proveedore
			var sampleProveedores = [sampleProveedore];

			// Set GET response
			$httpBackend.expectGET('proveedores').respond(sampleProveedores);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.proveedores).toEqualData(sampleProveedores);
		}));

		it('$scope.findOne() should create an array with one Proveedore object fetched from XHR using a proveedoreId URL parameter', inject(function(Proveedores) {
			// Define a sample Proveedore object
			var sampleProveedore = new Proveedores({
				name: 'New Proveedore'
			});

			// Set the URL parameter
			$stateParams.proveedoreId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/proveedores\/([0-9a-fA-F]{24})$/).respond(sampleProveedore);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.proveedore).toEqualData(sampleProveedore);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Proveedores) {
			// Create a sample Proveedore object
			var sampleProveedorePostData = new Proveedores({
				name: 'New Proveedore'
			});

			// Create a sample Proveedore response
			var sampleProveedoreResponse = new Proveedores({
				_id: '525cf20451979dea2c000001',
				name: 'New Proveedore'
			});

			// Fixture mock form input values
			scope.name = 'New Proveedore';

			// Set POST response
			$httpBackend.expectPOST('proveedores', sampleProveedorePostData).respond(sampleProveedoreResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Proveedore was created
			expect($location.path()).toBe('/proveedores/' + sampleProveedoreResponse._id);
		}));

		it('$scope.update() should update a valid Proveedore', inject(function(Proveedores) {
			// Define a sample Proveedore put data
			var sampleProveedorePutData = new Proveedores({
				_id: '525cf20451979dea2c000001',
				name: 'New Proveedore'
			});

			// Mock Proveedore in scope
			scope.proveedore = sampleProveedorePutData;

			// Set PUT response
			$httpBackend.expectPUT(/proveedores\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/proveedores/' + sampleProveedorePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid proveedoreId and remove the Proveedore from the scope', inject(function(Proveedores) {
			// Create new Proveedore object
			var sampleProveedore = new Proveedores({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Proveedores array and include the Proveedore
			scope.proveedores = [sampleProveedore];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/proveedores\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleProveedore);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.proveedores.length).toBe(0);
		}));
	});
}());