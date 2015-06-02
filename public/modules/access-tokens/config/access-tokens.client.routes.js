'use strict';

//Setting up route
angular.module('access-tokens').config(['$stateProvider',
	function($stateProvider) {
		// Access tokens state routing
		$stateProvider.
		state('listAccessTokens', {
			url: '/access-tokens',
			templateUrl: 'modules/access-tokens/views/list-access-tokens.client.view.html'
		}).
		state('createAccessToken', {
			url: '/access-tokens/create',
			templateUrl: 'modules/access-tokens/views/create-access-token.client.view.html'
		}).
		state('viewAccessToken', {
			url: '/access-tokens/:accessTokenId',
			templateUrl: 'modules/access-tokens/views/view-access-token.client.view.html'
		}).
		state('editAccessToken', {
			url: '/access-tokens/:accessTokenId/edit',
			templateUrl: 'modules/access-tokens/views/edit-access-token.client.view.html'
		});
	}
]);