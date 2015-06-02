'use strict';

(function() {
	// Oauth clients Controller Spec
	describe('Oauth clients Controller Tests', function() {
		// Initialize global variables
		var OauthClientsController,
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

			// Initialize the Oauth clients controller.
			OauthClientsController = $controller('OauthClientsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Oauth client object fetched from XHR', inject(function(OauthClients) {
			// Create sample Oauth client using the Oauth clients service
			var sampleOauthClient = new OauthClients({
				name: 'New Oauth client'
			});

			// Create a sample Oauth clients array that includes the new Oauth client
			var sampleOauthClients = [sampleOauthClient];

			// Set GET response
			$httpBackend.expectGET('oauth-clients').respond(sampleOauthClients);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.oauthClients).toEqualData(sampleOauthClients);
		}));

		it('$scope.findOne() should create an array with one Oauth client object fetched from XHR using a oauthClientId URL parameter', inject(function(OauthClients) {
			// Define a sample Oauth client object
			var sampleOauthClient = new OauthClients({
				name: 'New Oauth client'
			});

			// Set the URL parameter
			$stateParams.oauthClientId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/oauth-clients\/([0-9a-fA-F]{24})$/).respond(sampleOauthClient);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.oauthClient).toEqualData(sampleOauthClient);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(OauthClients) {
			// Create a sample Oauth client object
			var sampleOauthClientPostData = new OauthClients({
				name: 'New Oauth client'
			});

			// Create a sample Oauth client response
			var sampleOauthClientResponse = new OauthClients({
				_id: '525cf20451979dea2c000001',
				name: 'New Oauth client'
			});

			// Fixture mock form input values
			scope.name = 'New Oauth client';

			// Set POST response
			$httpBackend.expectPOST('oauth-clients', sampleOauthClientPostData).respond(sampleOauthClientResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Oauth client was created
			expect($location.path()).toBe('/oauth-clients/' + sampleOauthClientResponse._id);
		}));

		it('$scope.update() should update a valid Oauth client', inject(function(OauthClients) {
			// Define a sample Oauth client put data
			var sampleOauthClientPutData = new OauthClients({
				_id: '525cf20451979dea2c000001',
				name: 'New Oauth client'
			});

			// Mock Oauth client in scope
			scope.oauthClient = sampleOauthClientPutData;

			// Set PUT response
			$httpBackend.expectPUT(/oauth-clients\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/oauth-clients/' + sampleOauthClientPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid oauthClientId and remove the Oauth client from the scope', inject(function(OauthClients) {
			// Create new Oauth client object
			var sampleOauthClient = new OauthClients({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Oauth clients array and include the Oauth client
			scope.oauthClients = [sampleOauthClient];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/oauth-clients\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleOauthClient);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.oauthClients.length).toBe(0);
		}));
	});
}());