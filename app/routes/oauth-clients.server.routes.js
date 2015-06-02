'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var oauthClients = require('../../app/controllers/oauth-clients.server.controller');

	// Oauth clients Routes
	app.route('/oauth-clients')
		.get(oauthClients.list)
		.post(users.requiresLogin, oauthClients.create);

	app.route('/oauth-clients/:oauthClientId')
		.get(oauthClients.read)
		.put(users.requiresLogin, oauthClients.hasAuthorization, oauthClients.update)
		.delete(users.requiresLogin, oauthClients.hasAuthorization, oauthClients.delete);

	// Finish by binding the Oauth client middleware
	app.param('oauthClientId', oauthClients.oauthClientByID);
};
