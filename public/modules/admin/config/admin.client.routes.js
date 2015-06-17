'use strict';

//Setting up route
angular.module('admin').config(['$stateProvider',
	function($stateProvider) {
		// Admin state routing
		$stateProvider.
		state('admin-home', {
			url: '/admin-home',
			templateUrl: '/modules/admin/views/home.client.view.html'
		}).
        state('listUsers', {
			url: '/admin/users',
			templateUrl: '/modules/admin/views/list-users.client.view.html'
		}).
        state('showUser', {
			url: '/admin/users/:userId',
			templateUrl: '/modules/admin/views/view-user.client.view.html'
		}).
		state('editUser', {
			url: '/admin/users/:userId/edit',
			templateUrl: '/modules/admin/views/edit-profile.client.view.html'
		}).
        state('admin/listOauthClients', {
			url: '/admin/oauth-clients',
			templateUrl: '/modules/admin/views/list-oauth-clients.client.view.html'
		}).
        state('admin/showOauthClient/', {
			url: '/admin/oauth-clients/:oauthClientId',
			templateUrl: '/modules/admin/views/view-oauth-client.client.view.html'
		}).
        state('admin/editOauthClient/', {
			url: '/admin/oauth-clients/:oauthClientId/edit',
			templateUrl: '/modules/admin/views/edit-oauth-client.client.view.html'
		});
    }

]);

/*
angular.module('admin').run(['Menus',
	function(Menus) {
		Menus.addMenuItem('topbar', 'Admin', 'admin','dropdown',undefined,false,['user']);
		Menus.addSubMenuItem('topbar', 'admin', 'Oauth clients', 'admin/oauthclients');
		Menus.addSubMenuItem('topbar', 'admin', 'Users', 'admin/users');

	}
]);
*/

