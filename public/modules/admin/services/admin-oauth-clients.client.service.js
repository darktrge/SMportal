'use strict';

//Oauth clients service used to communicate Oauth clients REST endpoints
angular.module('oauth-clients').factory('AdminOauthClients', ['$resource',
	function($resource) {
		return $resource('/admin/oauth-clients/:oauthClientId', { oauthClientId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
