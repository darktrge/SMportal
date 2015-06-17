'use strict';

angular.module('admin').controller('AdminHomeController', ['$scope',
	function($scope) {

	}
]);

angular.module('admin').controller('AdminUserController', ['$scope', '$stateParams', '$location', 'Authentication', 'Userdata',
	function($scope, $stateParams, $location, Authentication, Userdata) {
		$scope.authentication = Authentication;

		// Update existing user

		$scope.update = function() {
			var oauthClient = $scope.oauthClient;
			oauthClient.$update(function() {
				$location.path('admin/users/' + Userdata._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};


		// Find a list of users
		$scope.find = function() {
			console.log('find user pokrenut');
			$scope.users = Userdata.query();
		};

		// Find existing users
		$scope.findOne = function() {
			console.log('findOne user pokrenut');
			$scope.user = Userdata.get({
				userId: $stateParams.userId
			});
		};

		$scope.updateUserProfile = function(isValid) {
			if (isValid) {
				$scope.success = $scope.error = null;
				var user = new Userdata($scope.user);

				user.$update(function(response) {
					$scope.success = true;
					//Authentication.user = response;
				}, function(response) {
					$scope.error = response.data.message;
				});
			} else {
				$scope.submitted = true;
			}
		};
	}
]);

angular.module('admin').controller('AdminOauthClientController', ['$scope', '$stateParams', '$location', 'Authentication', 'AdminOauthClients',
	function($scope, $stateParams, $location, Authentication, AdminOauthClients) {
		$scope.authentication = Authentication;

		// Update existing user

		$scope.update = function() {
			var oauthClient = $scope.oauthClient;
			oauthClient.$update(function() {
				$location.path('admin/oauth-clients/' + oauthClient._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};


		// Find a list of Oauth clients
		$scope.find = function() {
			$scope.oauthClients = AdminOauthClients.query();
		};

		// Find existing Oauth client
		$scope.findOne = function() {
			$scope.oauthClient = AdminOauthClients.get({
				oauthClientId: $stateParams.oauthClientId
			});
		};

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
					$location.path('/admin/oauth-clients');
				});
			}
		};
	}
]);
