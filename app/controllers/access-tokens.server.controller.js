'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	AccessToken = mongoose.model('AccessToken'),
	_ = require('lodash');

/**
 * Create a Access token
 */
exports.create = function(req, res) {
	var accessToken = new AccessToken(req.body);
	accessToken.user = req.user;

	accessToken.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(accessToken);
		}
	});
};

/**
 * Show the current Access token
 */
exports.read = function(req, res) {
	res.jsonp(req.accessToken);
};

/**
 * Update a Access token
 */
exports.update = function(req, res) {
	var accessToken = req.accessToken ;

	accessToken = _.extend(accessToken , req.body);

	accessToken.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(accessToken);
		}
	});
};

/**
 * Delete an Access token
 */
exports.delete = function(req, res) {
	var accessToken = req.accessToken ;

	accessToken.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(accessToken);
		}
	});
};

/**
 * List of Access tokens
 */
exports.list = function(req, res) { 
	AccessToken.find().sort('-created').populate('user', 'displayName').exec(function(err, accessTokens) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(accessTokens);
		}
	});
};

/**
 * Access token middleware
 */
exports.accessTokenByID = function(req, res, next, id) { 
	AccessToken.findById(id).populate('user', 'displayName').exec(function(err, accessToken) {
		if (err) return next(err);
		if (! accessToken) return next(new Error('Failed to load Access token ' + id));
		req.accessToken = accessToken ;
		next();
	});
};

/**
 * Access token authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.accessToken.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
