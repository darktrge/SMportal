'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport'),
    mongoose = require('mongoose'),
	User = mongoose.model('User'),
	path = require('path'),
	config = require('./config'),
    //lines added for below models
    BasicStrategy = require('passport-http').BasicStrategy,
    ClientPasswordStrategy = require('passport-oauth2-client-password').Strategy,
    BearerStrategy = require('passport-http-bearer').Strategy,
    AccessToken = mongoose.model('AccessToken'),
    RequestToken = mongoose.model('RequestToken'),
    OAuthClient = mongoose.model('OAuthClient'),
    debug = require('debug')('oauth2');
	
/**
 * Module init function.
 */
module.exports = function() {
	// Serialize sessions
	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});

	// Deserialize sessions
	passport.deserializeUser(function(id, done) {
		User.findOne({
			_id: id
		}, '-salt -password', function(err, user) {
			done(err, user);
		});
	});

	// Initialize strategies
	config.getGlobbedFiles('./config/strategies/**/*.js').forEach(function(strategy) {
		require(path.resolve(strategy))();
	});

    // Use basic strategy for OAuth
    passport.use(new BasicStrategy(function (clientKey, clientSecret, done) {
        debug('BaS: clientKey: %s, clientSecret: %s', clientKey, clientSecret);
        OAuthClient.findOne({ clientKey: clientKey, clientSecret: clientSecret }, function (err, client) {
            //debug('BaS: clientKey: %s, clientToken: %s, err: %s, client: %s', clientKey, clientSecret, err, client);
            if (err) return done(err);
            if (!client) return done(null, false);
            return done(null, client);
        });
    }));

    // Use client password strategy for OAuth2 clients
    passport.use(new ClientPasswordStrategy(function (clientKey, clientToken, done) {
        debug('CPS: key: %s, token: %s', clientKey, clientToken);
        OAuthClient.findOne({ clientKey: clientKey, clientSecret: clientToken }, function (err, client) {
            //debug('CPS: client: %s, err: %s', client, err);
            if (err) return done(err);
            if (!client) return done(null, false);
            return done(null, client);
        });
    }));

    // Use bearer strategy
    passport.use(new BearerStrategy(function (accessToken, done) {
        debug('BeS: accessToken: %s', accessToken);
        AccessToken.findOne({ token: accessToken }, function (err, token) {
            if (err) return done(err);
            if (!token) return done(null, false);
            debug('BeS: user_id: %s', token.user_id);
            User.findOne({ _id: token.user_id }, function (err, user) {
                //debug('BeS: user: %s, err: %s', user, err);
                if (err) return done(err);
                if (!user) return done(null, false);
                return done(null, user);
            });
        });
    }));
};