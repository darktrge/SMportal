'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	RequestToken = mongoose.model('RequestToken'),
	_ = require('lodash');

/**
 * Create a Request token
 */
exports.create = function(req, res) {
	var requestToken = new RequestToken(req.body);
	requestToken.user = req.user;

	requestToken.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(requestToken);
		}
	});
};

/**
 * Show the current Request token
 */
exports.read = function(req, res) {
	res.jsonp(req.requestToken);
};

/**
 * Update a Request token
 */
exports.update = function(req, res) {
	var requestToken = req.requestToken ;

	requestToken = _.extend(requestToken , req.body);

	requestToken.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(requestToken);
		}
	});
};

/**
 * Delete an Request token
 */
exports.delete = function(req, res) {
	var requestToken = req.requestToken ;

	requestToken.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(requestToken);
		}
	});
};

/**
 * List of Request tokens
 */
exports.list = function(req, res) { 
	RequestToken.find().sort('-created').populate('user', 'displayName').exec(function(err, requestTokens) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(requestTokens);
		}
	});
};

/**
 * Request token middleware
 */
exports.requestTokenByID = function(req, res, next, id) { 
	RequestToken.findById(id).populate('user', 'displayName').exec(function(err, requestToken) {
		if (err) return next(err);
		if (! requestToken) return next(new Error('Failed to load Request token ' + id));
		req.requestToken = requestToken ;
		next();
	});
};

/**
 * Request token authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.requestToken.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
