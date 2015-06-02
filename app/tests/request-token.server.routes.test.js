'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	RequestToken = mongoose.model('RequestToken'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, requestToken;

/**
 * Request token routes tests
 */
describe('Request token CRUD tests', function() {
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

		// Save a user to the test db and create new Request token
		user.save(function() {
			requestToken = {
				name: 'Request token Name'
			};

			done();
		});
	});

	it('should be able to save Request token instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Request token
				agent.post('/request-tokens')
					.send(requestToken)
					.expect(200)
					.end(function(requestTokenSaveErr, requestTokenSaveRes) {
						// Handle Request token save error
						if (requestTokenSaveErr) done(requestTokenSaveErr);

						// Get a list of Request tokens
						agent.get('/request-tokens')
							.end(function(requestTokensGetErr, requestTokensGetRes) {
								// Handle Request token save error
								if (requestTokensGetErr) done(requestTokensGetErr);

								// Get Request tokens list
								var requestTokens = requestTokensGetRes.body;

								// Set assertions
								(requestTokens[0].user._id).should.equal(userId);
								(requestTokens[0].name).should.match('Request token Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Request token instance if not logged in', function(done) {
		agent.post('/request-tokens')
			.send(requestToken)
			.expect(401)
			.end(function(requestTokenSaveErr, requestTokenSaveRes) {
				// Call the assertion callback
				done(requestTokenSaveErr);
			});
	});

	it('should not be able to save Request token instance if no name is provided', function(done) {
		// Invalidate name field
		requestToken.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Request token
				agent.post('/request-tokens')
					.send(requestToken)
					.expect(400)
					.end(function(requestTokenSaveErr, requestTokenSaveRes) {
						// Set message assertion
						(requestTokenSaveRes.body.message).should.match('Please fill Request token name');
						
						// Handle Request token save error
						done(requestTokenSaveErr);
					});
			});
	});

	it('should be able to update Request token instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Request token
				agent.post('/request-tokens')
					.send(requestToken)
					.expect(200)
					.end(function(requestTokenSaveErr, requestTokenSaveRes) {
						// Handle Request token save error
						if (requestTokenSaveErr) done(requestTokenSaveErr);

						// Update Request token name
						requestToken.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Request token
						agent.put('/request-tokens/' + requestTokenSaveRes.body._id)
							.send(requestToken)
							.expect(200)
							.end(function(requestTokenUpdateErr, requestTokenUpdateRes) {
								// Handle Request token update error
								if (requestTokenUpdateErr) done(requestTokenUpdateErr);

								// Set assertions
								(requestTokenUpdateRes.body._id).should.equal(requestTokenSaveRes.body._id);
								(requestTokenUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Request tokens if not signed in', function(done) {
		// Create new Request token model instance
		var requestTokenObj = new RequestToken(requestToken);

		// Save the Request token
		requestTokenObj.save(function() {
			// Request Request tokens
			request(app).get('/request-tokens')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Request token if not signed in', function(done) {
		// Create new Request token model instance
		var requestTokenObj = new RequestToken(requestToken);

		// Save the Request token
		requestTokenObj.save(function() {
			request(app).get('/request-tokens/' + requestTokenObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', requestToken.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Request token instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Request token
				agent.post('/request-tokens')
					.send(requestToken)
					.expect(200)
					.end(function(requestTokenSaveErr, requestTokenSaveRes) {
						// Handle Request token save error
						if (requestTokenSaveErr) done(requestTokenSaveErr);

						// Delete existing Request token
						agent.delete('/request-tokens/' + requestTokenSaveRes.body._id)
							.send(requestToken)
							.expect(200)
							.end(function(requestTokenDeleteErr, requestTokenDeleteRes) {
								// Handle Request token error error
								if (requestTokenDeleteErr) done(requestTokenDeleteErr);

								// Set assertions
								(requestTokenDeleteRes.body._id).should.equal(requestTokenSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Request token instance if not signed in', function(done) {
		// Set Request token user 
		requestToken.user = user;

		// Create new Request token model instance
		var requestTokenObj = new RequestToken(requestToken);

		// Save the Request token
		requestTokenObj.save(function() {
			// Try deleting Request token
			request(app).delete('/request-tokens/' + requestTokenObj._id)
			.expect(401)
			.end(function(requestTokenDeleteErr, requestTokenDeleteRes) {
				// Set message assertion
				(requestTokenDeleteRes.body.message).should.match('User is not logged in');

				// Handle Request token error error
				done(requestTokenDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		RequestToken.remove().exec();
		done();
	});
});