'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var requestTokens = require('../../app/controllers/request-tokens.server.controller');

	// Request tokens Routes
	app.route('/request-tokens')
		.get(requestTokens.list)
		.post(users.requiresLogin, requestTokens.create);

	app.route('/request-tokens/:requestTokenId')
		.get(requestTokens.read)
		.put(users.requiresLogin, requestTokens.hasAuthorization, requestTokens.update)
		.delete(users.requiresLogin, requestTokens.hasAuthorization, requestTokens.delete);

	// Finish by binding the Request token middleware
	app.param('requestTokenId', requestTokens.requestTokenByID);
};
