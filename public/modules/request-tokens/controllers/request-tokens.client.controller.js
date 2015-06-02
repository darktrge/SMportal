'use strict';

// Request tokens controller
angular.module('request-tokens').controller('RequestTokensController', ['$scope', '$stateParams', '$location', 'Authentication', 'RequestTokens',
	function($scope, $stateParams, $location, Authentication, RequestTokens) {
		$scope.authentication = Authentication;

		// Create new Request token
		$scope.create = function() {
			// Create new Request token object
			var requestToken = new RequestTokens ({
				name: this.name
			});

			// Redirect after save
			requestToken.$save(function(response) {
				$location.path('request-tokens/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Request token
		$scope.remove = function(requestToken) {
			if ( requestToken ) { 
				requestToken.$remove();

				for (var i in $scope.requestTokens) {
					if ($scope.requestTokens [i] === requestToken) {
						$scope.requestTokens.splice(i, 1);
					}
				}
			} else {
				$scope.requestToken.$remove(function() {
					$location.path('request-tokens');
				});
			}
		};

		// Update existing Request token
		$scope.update = function() {
			var requestToken = $scope.requestToken;

			requestToken.$update(function() {
				$location.path('request-tokens/' + requestToken._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Request tokens
		$scope.find = function() {
			$scope.requestTokens = RequestTokens.query();
		};

		// Find existing Request token
		$scope.findOne = function() {
			$scope.requestToken = RequestTokens.get({ 
				requestTokenId: $stateParams.requestTokenId
			});
		};
	}
]);