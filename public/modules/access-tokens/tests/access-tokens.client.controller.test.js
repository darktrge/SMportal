'use strict';

(function() {
	// Access tokens Controller Spec
	describe('Access tokens Controller Tests', function() {
		// Initialize global variables
		var AccessTokensController,
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

			// Initialize the Access tokens controller.
			AccessTokensController = $controller('AccessTokensController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Access token object fetched from XHR', inject(function(AccessTokens) {
			// Create sample Access token using the Access tokens service
			var sampleAccessToken = new AccessTokens({
				name: 'New Access token'
			});

			// Create a sample Access tokens array that includes the new Access token
			var sampleAccessTokens = [sampleAccessToken];

			// Set GET response
			$httpBackend.expectGET('access-tokens').respond(sampleAccessTokens);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.accessTokens).toEqualData(sampleAccessTokens);
		}));

		it('$scope.findOne() should create an array with one Access token object fetched from XHR using a accessTokenId URL parameter', inject(function(AccessTokens) {
			// Define a sample Access token object
			var sampleAccessToken = new AccessTokens({
				name: 'New Access token'
			});

			// Set the URL parameter
			$stateParams.accessTokenId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/access-tokens\/([0-9a-fA-F]{24})$/).respond(sampleAccessToken);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.accessToken).toEqualData(sampleAccessToken);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(AccessTokens) {
			// Create a sample Access token object
			var sampleAccessTokenPostData = new AccessTokens({
				name: 'New Access token'
			});

			// Create a sample Access token response
			var sampleAccessTokenResponse = new AccessTokens({
				_id: '525cf20451979dea2c000001',
				name: 'New Access token'
			});

			// Fixture mock form input values
			scope.name = 'New Access token';

			// Set POST response
			$httpBackend.expectPOST('access-tokens', sampleAccessTokenPostData).respond(sampleAccessTokenResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Access token was created
			expect($location.path()).toBe('/access-tokens/' + sampleAccessTokenResponse._id);
		}));

		it('$scope.update() should update a valid Access token', inject(function(AccessTokens) {
			// Define a sample Access token put data
			var sampleAccessTokenPutData = new AccessTokens({
				_id: '525cf20451979dea2c000001',
				name: 'New Access token'
			});

			// Mock Access token in scope
			scope.accessToken = sampleAccessTokenPutData;

			// Set PUT response
			$httpBackend.expectPUT(/access-tokens\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/access-tokens/' + sampleAccessTokenPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid accessTokenId and remove the Access token from the scope', inject(function(AccessTokens) {
			// Create new Access token object
			var sampleAccessToken = new AccessTokens({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Access tokens array and include the Access token
			scope.accessTokens = [sampleAccessToken];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/access-tokens\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleAccessToken);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.accessTokens.length).toBe(0);
		}));
	});
}());