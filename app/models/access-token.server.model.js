'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Access token Schema
 */
var AccessTokenSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    token: String,
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    client: {
        type: Schema.ObjectId,
        ref: 'OAuthClient'
    }
});

AccessTokenSchema.statics = {
    load: function(id, cb) {
        this.findOne({
            _id: id
        }).exec(cb);
    }
};

mongoose.model('AccessToken', AccessTokenSchema);