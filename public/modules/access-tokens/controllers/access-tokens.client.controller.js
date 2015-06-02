'use strict';

// Access tokens controller
angular.module('access-tokens').controller('AccessTokensController', ['$scope', '$stateParams', '$location', 'Authentication', 'AccessTokens',
	function($scope, $stateParams, $location, Authentication, AccessTokens) {
		$scope.authentication = Authentication;

		// Create new Access token
		$scope.create = function() {
			// Create new Access token object
			var accessToken = new AccessTokens ({
				name: this.name
			});

			// Redirect after save
			accessToken.$save(function(response) {
				$location.path('access-tokens/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Access token
		$scope.remove = function(accessToken) {
			if ( accessToken ) { 
				accessToken.$remove();

				for (var i in $scope.accessTokens) {
					if ($scope.accessTokens [i] === accessToken) {
						$scope.accessTokens.splice(i, 1);
					}
				}
			} else {
				$scope.accessToken.$remove(function() {
					$location.path('access-tokens');
				});
			}
		};

		// Update existing Access token
		$scope.update = function() {
			var accessToken = $scope.accessToken;

			accessToken.$update(function() {
				$location.path('access-tokens/' + accessToken._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Access tokens
		$scope.find = function() {
			$scope.accessTokens = AccessTokens.query();
		};

		// Find existing Access token
		$scope.findOne = function() {
			$scope.accessToken = AccessTokens.get({ 
				accessTokenId: $stateParams.accessTokenId
			});
		};
	}
]);