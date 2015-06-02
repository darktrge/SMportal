'use strict';

var async = require('async');

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var clients = require('../../app/controllers/oauth-clients.server.controller');
    var oauth2 = require('../../config/middlewares/oauth2');
    var authorization = require('../../config/middlewares/authorization');

	// Oauthclients Routes
	/*app.route('/oauth')
		.get(clients.list)
		.post(users.requiresLogin, clients.create);*/


    app.get('/signin', users.signin);
    app.get('/signup', users.signup);
    app.get('/signout', users.signout);

    //Resource Owner Password Credentials
	app.route('/oauth/authorize')
		.get(authorization.requiresLogin, oauth2.authorization, oauth2.dialog);

	app.route('/oauth/authorize/decision')
		.post(authorization.requiresLogin, oauth2.server.decision());

	app.route('/oauth/token')
		.post(oauth2.token);

	// Register parameters
    app.param('clientId', clients.oauthClientByID);
};
