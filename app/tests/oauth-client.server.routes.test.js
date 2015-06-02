'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	OauthClient = mongoose.model('OauthClient'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, oauthClient;

/**
 * Oauth client routes tests
 */
describe('Oauth client CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Oauth client
		user.save(function() {
			oauthClient = {
				name: 'Oauth client Name'
			};

			done();
		});
	});

	it('should be able to save Oauth client instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Oauth client
				agent.post('/oauth-clients')
					.send(oauthClient)
					.expect(200)
					.end(function(oauthClientSaveErr, oauthClientSaveRes) {
						// Handle Oauth client save error
						if (oauthClientSaveErr) done(oauthClientSaveErr);

						// Get a list of Oauth clients
						agent.get('/oauth-clients')
							.end(function(oauthClientsGetErr, oauthClientsGetRes) {
								// Handle Oauth client save error
								if (oauthClientsGetErr) done(oauthClientsGetErr);

								// Get Oauth clients list
								var oauthClients = oauthClientsGetRes.body;

								// Set assertions
								(oauthClients[0].user._id).should.equal(userId);
								(oauthClients[0].name).should.match('Oauth client Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Oauth client instance if not logged in', function(done) {
		agent.post('/oauth-clients')
			.send(oauthClient)
			.expect(401)
			.end(function(oauthClientSaveErr, oauthClientSaveRes) {
				// Call the assertion callback
				done(oauthClientSaveErr);
			});
	});

	it('should not be able to save Oauth client instance if no name is provided', function(done) {
		// Invalidate name field
		oauthClient.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Oauth client
				agent.post('/oauth-clients')
					.send(oauthClient)
					.expect(400)
					.end(function(oauthClientSaveErr, oauthClientSaveRes) {
						// Set message assertion
						(oauthClientSaveRes.body.message).should.match('Please fill Oauth client name');
						
						// Handle Oauth client save error
						done(oauthClientSaveErr);
					});
			});
	});

	it('should be able to update Oauth client instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Oauth client
				agent.post('/oauth-clients')
					.send(oauthClient)
					.expect(200)
					.end(function(oauthClientSaveErr, oauthClientSaveRes) {
						// Handle Oauth client save error
						if (oauthClientSaveErr) done(oauthClientSaveErr);

						// Update Oauth client name
						oauthClient.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Oauth client
						agent.put('/oauth-clients/' + oauthClientSaveRes.body._id)
							.send(oauthClient)
							.expect(200)
							.end(function(oauthClientUpdateErr, oauthClientUpdateRes) {
								// Handle Oauth client update error
								if (oauthClientUpdateErr) done(oauthClientUpdateErr);

								// Set assertions
								(oauthClientUpdateRes.body._id).should.equal(oauthClientSaveRes.body._id);
								(oauthClientUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Oauth clients if not signed in', function(done) {
		// Create new Oauth client model instance
		var oauthClientObj = new OauthClient(oauthClient);

		// Save the Oauth client
		oauthClientObj.save(function() {
			// Request Oauth clients
			request(app).get('/oauth-clients')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Oauth client if not signed in', function(done) {
		// Create new Oauth client model instance
		var oauthClientObj = new OauthClient(oauthClient);

		// Save the Oauth client
		oauthClientObj.save(function() {
			request(app).get('/oauth-clients/' + oauthClientObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', oauthClient.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Oauth client instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Oauth client
				agent.post('/oauth-clients')
					.send(oauthClient)
					.expect(200)
					.end(function(oauthClientSaveErr, oauthClientSaveRes) {
						// Handle Oauth client save error
						if (oauthClientSaveErr) done(oauthClientSaveErr);

						// Delete existing Oauth client
						agent.delete('/oauth-clients/' + oauthClientSaveRes.body._id)
							.send(oauthClient)
							.expect(200)
							.end(function(oauthClientDeleteErr, oauthClientDeleteRes) {
								// Handle Oauth client error error
								if (oauthClientDeleteErr) done(oauthClientDeleteErr);

								// Set assertions
								(oauthClientDeleteRes.body._id).should.equal(oauthClientSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Oauth client instance if not signed in', function(done) {
		// Set Oauth client user 
		oauthClient.user = user;

		// Create new Oauth client model instance
		var oauthClientObj = new OauthClient(oauthClient);

		// Save the Oauth client
		oauthClientObj.save(function() {
			// Try deleting Oauth client
			request(app).delete('/oauth-clients/' + oauthClientObj._id)
			.expect(401)
			.end(function(oauthClientDeleteErr, oauthClientDeleteRes) {
				// Set message assertion
				(oauthClientDeleteRes.body.message).should.match('User is not logged in');

				// Handle Oauth client error error
				done(oauthClientDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		OauthClient.remove().exec();
		done();
	});
});