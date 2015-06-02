'use strict';

//Setting up route
angular.module('oauth-clients').config(['$stateProvider',
	function($stateProvider) {
		// Oauth clients state routing
		$stateProvider.
		state('listOauthClients', {
			url: '/oauth-clients',
			templateUrl: 'modules/oauth-clients/views/list-oauth-clients.client.view.html'
		}).
		state('createOauthClient', {
			url: '/oauth-clients/create',
			templateUrl: 'modules/oauth-clients/views/create-oauth-client.client.view.html'
		}).
		state('viewOauthClient', {
			url: '/oauth-clients/:oauthClientId',
			templateUrl: 'modules/oauth-clients/views/view-oauth-client.client.view.html'
		}).
		state('editOauthClient', {
			url: '/oauth-clients/:oauthClientId/edit',
			templateUrl: 'modules/oauth-clients/views/edit-oauth-client.client.view.html'
		});
	}
]);