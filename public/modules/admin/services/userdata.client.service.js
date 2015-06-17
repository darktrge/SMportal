'use strict';

//Oauth clients service used to communicate Oauth clients REST endpoints
angular.module('admin').factory('Userdata', ['$resource',
	function($resource) {
		return $resource('admin/users/:userId', { userId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);

