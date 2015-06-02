'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Oauthclient = mongoose.model('Oauthclient');

/**
 * Globals
 */
var user, oauthclient;

/**
 * Unit tests
 */
describe('Oauthclient Model Unit Tests:', function() {
	beforeEach(function(done) {
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: 'username',
			password: 'password'
		});

		user.save(function() { 
			oauthclient = new Oauthclient({
				name: 'Oauthclient Name',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return oauthclient.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) { 
			oauthclient.name = '';

			return oauthclient.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		Oauthclient.remove().exec();
		User.remove().exec();

		done();
	});
});