'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	AccessToken = mongoose.model('AccessToken'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, accessToken;

/**
 * Access token routes tests
 */
describe('Access token CRUD tests', function() {
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

		// Save a user to the test db and create new Access token
		user.save(function() {
			accessToken = {
				name: 'Access token Name'
			};

			done();
		});
	});

	it('should be able to save Access token instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Access token
				agent.post('/access-tokens')
					.send(accessToken)
					.expect(200)
					.end(function(accessTokenSaveErr, accessTokenSaveRes) {
						// Handle Access token save error
						if (accessTokenSaveErr) done(accessTokenSaveErr);

						// Get a list of Access tokens
						agent.get('/access-tokens')
							.end(function(accessTokensGetErr, accessTokensGetRes) {
								// Handle Access token save error
								if (accessTokensGetErr) done(accessTokensGetErr);

								// Get Access tokens list
								var accessTokens = accessTokensGetRes.body;

								// Set assertions
								(accessTokens[0].user._id).should.equal(userId);
								(accessTokens[0].name).should.match('Access token Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Access token instance if not logged in', function(done) {
		agent.post('/access-tokens')
			.send(accessToken)
			.expect(401)
			.end(function(accessTokenSaveErr, accessTokenSaveRes) {
				// Call the assertion callback
				done(accessTokenSaveErr);
			});
	});

	it('should not be able to save Access token instance if no name is provided', function(done) {
		// Invalidate name field
		accessToken.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Access token
				agent.post('/access-tokens')
					.send(accessToken)
					.expect(400)
					.end(function(accessTokenSaveErr, accessTokenSaveRes) {
						// Set message assertion
						(accessTokenSaveRes.body.message).should.match('Please fill Access token name');
						
						// Handle Access token save error
						done(accessTokenSaveErr);
					});
			});
	});

	it('should be able to update Access token instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Access token
				agent.post('/access-tokens')
					.send(accessToken)
					.expect(200)
					.end(function(accessTokenSaveErr, accessTokenSaveRes) {
						// Handle Access token save error
						if (accessTokenSaveErr) done(accessTokenSaveErr);

						// Update Access token name
						accessToken.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Access token
						agent.put('/access-tokens/' + accessTokenSaveRes.body._id)
							.send(accessToken)
							.expect(200)
							.end(function(accessTokenUpdateErr, accessTokenUpdateRes) {
								// Handle Access token update error
								if (accessTokenUpdateErr) done(accessTokenUpdateErr);

								// Set assertions
								(accessTokenUpdateRes.body._id).should.equal(accessTokenSaveRes.body._id);
								(accessTokenUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Access tokens if not signed in', function(done) {
		// Create new Access token model instance
		var accessTokenObj = new AccessToken(accessToken);

		// Save the Access token
		accessTokenObj.save(function() {
			// Request Access tokens
			request(app).get('/access-tokens')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Access token if not signed in', function(done) {
		// Create new Access token model instance
		var accessTokenObj = new AccessToken(accessToken);

		// Save the Access token
		accessTokenObj.save(function() {
			request(app).get('/access-tokens/' + accessTokenObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', accessToken.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Access token instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Access token
				agent.post('/access-tokens')
					.send(accessToken)
					.expect(200)
					.end(function(accessTokenSaveErr, accessTokenSaveRes) {
						// Handle Access token save error
						if (accessTokenSaveErr) done(accessTokenSaveErr);

						// Delete existing Access token
						agent.delete('/access-tokens/' + accessTokenSaveRes.body._id)
							.send(accessToken)
							.expect(200)
							.end(function(accessTokenDeleteErr, accessTokenDeleteRes) {
								// Handle Access token error error
								if (accessTokenDeleteErr) done(accessTokenDeleteErr);

								// Set assertions
								(accessTokenDeleteRes.body._id).should.equal(accessTokenSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Access token instance if not signed in', function(done) {
		// Set Access token user 
		accessToken.user = user;

		// Create new Access token model instance
		var accessTokenObj = new AccessToken(accessToken);

		// Save the Access token
		accessTokenObj.save(function() {
			// Try deleting Access token
			request(app).delete('/access-tokens/' + accessTokenObj._id)
			.expect(401)
			.end(function(accessTokenDeleteErr, accessTokenDeleteRes) {
				// Set message assertion
				(accessTokenDeleteRes.body.message).should.match('User is not logged in');

				// Handle Access token error error
				done(accessTokenDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		AccessToken.remove().exec();
		done();
	});
});