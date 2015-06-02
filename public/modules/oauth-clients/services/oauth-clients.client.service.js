'use strict';

//Oauth clients service used to communicate Oauth clients REST endpoints
angular.module('oauth-clients').factory('OauthClients', ['$resource',
	function($resource) {
		return $resource('oauth-clients/:oauthClientId', { oauthClientId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);