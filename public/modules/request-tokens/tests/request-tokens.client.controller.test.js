'use strict';

(function() {
	// Request tokens Controller Spec
	describe('Request tokens Controller Tests', function() {
		// Initialize global variables
		var RequestTokensController,
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

			// Initialize the Request tokens controller.
			RequestTokensController = $controller('RequestTokensController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Request token object fetched from XHR', inject(function(RequestTokens) {
			// Create sample Request token using the Request tokens service
			var sampleRequestToken = new RequestTokens({
				name: 'New Request token'
			});

			// Create a sample Request tokens array that includes the new Request token
			var sampleRequestTokens = [sampleRequestToken];

			// Set GET response
			$httpBackend.expectGET('request-tokens').respond(sampleRequestTokens);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.requestTokens).toEqualData(sampleRequestTokens);
		}));

		it('$scope.findOne() should create an array with one Request token object fetched from XHR using a requestTokenId URL parameter', inject(function(RequestTokens) {
			// Define a sample Request token object
			var sampleRequestToken = new RequestTokens({
				name: 'New Request token'
			});

			// Set the URL parameter
			$stateParams.requestTokenId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/request-tokens\/([0-9a-fA-F]{24})$/).respond(sampleRequestToken);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.requestToken).toEqualData(sampleRequestToken);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(RequestTokens) {
			// Create a sample Request token object
			var sampleRequestTokenPostData = new RequestTokens({
				name: 'New Request token'
			});

			// Create a sample Request token response
			var sampleRequestTokenResponse = new RequestTokens({
				_id: '525cf20451979dea2c000001',
				name: 'New Request token'
			});

			// Fixture mock form input values
			scope.name = 'New Request token';

			// Set POST response
			$httpBackend.expectPOST('request-tokens', sampleRequestTokenPostData).respond(sampleRequestTokenResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Request token was created
			expect($location.path()).toBe('/request-tokens/' + sampleRequestTokenResponse._id);
		}));

		it('$scope.update() should update a valid Request token', inject(function(RequestTokens) {
			// Define a sample Request token put data
			var sampleRequestTokenPutData = new RequestTokens({
				_id: '525cf20451979dea2c000001',
				name: 'New Request token'
			});

			// Mock Request token in scope
			scope.requestToken = sampleRequestTokenPutData;

			// Set PUT response
			$httpBackend.expectPUT(/request-tokens\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/request-tokens/' + sampleRequestTokenPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid requestTokenId and remove the Request token from the scope', inject(function(RequestTokens) {
			// Create new Request token object
			var sampleRequestToken = new RequestTokens({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Request tokens array and include the Request token
			scope.requestTokens = [sampleRequestToken];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/request-tokens\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleRequestToken);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.requestTokens.length).toBe(0);
		}));
	});
}());