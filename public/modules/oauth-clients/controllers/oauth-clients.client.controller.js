'use strict';

// Oauth clients controller
angular.module('oauth-clients').controller('OauthClientsController', ['$scope', '$stateParams', '$location', 'Authentication', 'OauthClients',
	function($scope, $stateParams, $location, Authentication, OauthClients) {
		$scope.authentication = Authentication;

		// Create new Oauth client
		$scope.create = function() {
			// Create new Oauth client object
			var oauthClient = new OauthClients ({
				name: this.name,
				clientKey: this.clientKey,
                clientSecret: this.clientSecret
			});

			// Redirect after save
			oauthClient.$save(function(response) {
				$location.path('oauth-clients/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Oauth client
		$scope.remove = function(oauthClient) {
			if ( oauthClient ) { 
				oauthClient.$remove();

				for (var i in $scope.oauthClients) {
					if ($scope.oauthClients [i] === oauthClient) {
						$scope.oauthClients.splice(i, 1);
					}
				}
			} else {
				$scope.oauthClient.$remove(function() {
					$location.path('oauth-clients');
				});
			}
		};

		// Update existing Oauth client
		$scope.update = function() {
			var oauthClient = $scope.oauthClient;

			oauthClient.$update(function() {
				$location.path('oauth-clients/' + oauthClient._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Oauth clients
		$scope.find = function() {
			$scope.oauthClients = OauthClients.query();
		};

		// Find existing Oauth client
		$scope.findOne = function() {
			$scope.oauthClient = OauthClients.get({ 
				oauthClientId: $stateParams.oauthClientId
			});
		};
	}
]);