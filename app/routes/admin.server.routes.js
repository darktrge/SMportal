'use strict';

module.exports = function(app) {
    var admin = require('../../app/controllers/admin.server.controller');
    var users = require('../../app/controllers/users.server.controller');
    var oauthClients = require('../../app/controllers/oauth-clients.server.controller');
    //var oauthClients = require('../../app/controllers/users.server.controller');

    app.route('/admin').get(users.hasAuthorization(['admin']),admin.index);
    app.route('/admin/users').get(users.hasAuthorization(['admin']),admin.listUsers);
    app.route('/admin/users/:userId').get(users.hasAuthorization(['admin']),admin.userByID);

    app.param('userId', users.userByID);

    app.route('/admin/oauth-clients')
        .get(users.hasAuthorization(['admin']),admin.listOauthClients)
        .post(users.requiresLogin, oauthClients.create);

    app.route('/admin/oauth-clients/:oauthClientId')
        .get(users.requiresLogin, users.hasAuthorization(['admin']), oauthClients.read)
        .put(users.requiresLogin, users.hasAuthorization(['admin']), oauthClients.update)
        .delete(users.requiresLogin, users.hasAuthorization(['admin']), oauthClients.delete);

    app.param('oauthClientId', oauthClients.oauthClientByID);
};
