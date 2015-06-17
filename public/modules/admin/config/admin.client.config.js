'use strict';

angular.module('admin').run(['Menus',
	function(Menus) {
		Menus.addMenuItem('topbar', 'Admin', 'admin','dropdown',undefined,false,['user']); //TODO: change last key to admin
		Menus.addSubMenuItem('topbar', 'admin', 'Oauth clients', 'admin/oauth-clients');
		Menus.addSubMenuItem('topbar', 'admin', 'Users', 'admin/users');

	}
]);
