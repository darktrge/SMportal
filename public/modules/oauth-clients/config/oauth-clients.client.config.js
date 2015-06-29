'use strict';

// Configuring the Articles module
angular.module('oauth-clients').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'My Oauth clients', 'oauth-clients', 'dropdown', '/oauth-clients(/create)?',false,['developer']);
		Menus.addSubMenuItem('topbar', 'oauth-clients', 'List Oauth clients', 'oauth-clients');
		Menus.addSubMenuItem('topbar', 'oauth-clients', 'New Oauth client', 'oauth-clients/create');
	}
]);
