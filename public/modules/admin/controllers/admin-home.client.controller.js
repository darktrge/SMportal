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


		// Find a list of Oauth clients
		$scope.find = function() {
			$scope.users = Userdata.query();
		};

		// Find existing Oauth client
		$scope.findOne = function() {
			$scope.user = Userdata.get({
				userId: $stateParams.userId
			});
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
	}
]);
