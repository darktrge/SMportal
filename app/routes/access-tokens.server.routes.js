'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var accessTokens = require('../../app/controllers/access-tokens.server.controller');

	// Access tokens Routes
	app.route('/access-tokens')
		.get(accessTokens.list)
		.post(users.requiresLogin, accessTokens.create);

	app.route('/access-tokens/:accessTokenId')
		.get(accessTokens.read)
		.put(users.requiresLogin, accessTokens.hasAuthorization, accessTokens.update)
		.delete(users.requiresLogin, accessTokens.hasAuthorization, accessTokens.delete);

	// Finish by binding the Access token middleware
	app.param('accessTokenId', accessTokens.accessTokenByID);
};
