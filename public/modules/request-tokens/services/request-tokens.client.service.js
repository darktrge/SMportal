'use strict';

//Request tokens service used to communicate Request tokens REST endpoints
angular.module('request-tokens').factory('RequestTokens', ['$resource',
	function($resource) {
		return $resource('request-tokens/:requestTokenId', { requestTokenId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);