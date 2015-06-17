'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    OAuthClient = mongoose.model('OAuthClient'),
    errorHandler = require('./errors.server.controller'),
    _ = require('lodash');

exports.index = function(req, res){
    res.render('admin-index', {
        user: req.user || null,
        request: req
    });
};
//below are dummy interfaces of no practical use :)
/**
 * Create a Admin
 */

exports.listUsers = function(req, res) {
    User.find({}).sort('-created').exec(function(err, users) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(users);
        }
    });
};

exports.userByID = function(req, res) {
    //console.log(req.params.userId);
    User.findById(req.params.userId).exec(function(err, user) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(user);
        }
    });
};

exports.listOauthClients = function(req, res) {
    OAuthClient.find().sort('-created').exec(function(err, oauthClients) {
        //console.log(oauthClients);
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(oauthClients);
        }
    });
};

exports.create = function(req, res) {

};

/**
 * Show the current Admin
 */
exports.userRead = function(req, res) {
    res.json(req.user);
};

/**
 * Update a Admin
 */
exports.update = function(req, res) {

};

/**
 * Delete an Admin
 */
exports.delete = function(req, res) {

};

/**
 * List of Admins
 */
exports.list = function(req, res) {

};
