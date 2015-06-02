'use strict';

//Setting up route
angular.module('request-tokens').config(['$stateProvider',
	function($stateProvider) {
		// Request tokens state routing
		$stateProvider.
		state('listRequestTokens', {
			url: '/request-tokens',
			templateUrl: 'modules/request-tokens/views/list-request-tokens.client.view.html'
		}).
		state('createRequestToken', {
			url: '/request-tokens/create',
			templateUrl: 'modules/request-tokens/views/create-request-token.client.view.html'
		}).
		state('viewRequestToken', {
			url: '/request-tokens/:requestTokenId',
			templateUrl: 'modules/request-tokens/views/view-request-token.client.view.html'
		}).
		state('editRequestToken', {
			url: '/request-tokens/:requestTokenId/edit',
			templateUrl: 'modules/request-tokens/views/edit-request-token.client.view.html'
		});
	}
]);