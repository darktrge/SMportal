'use strict';

module.exports = {
	db: 'mongodb://localhost/smportal-test',
	port: 3001,
	app: {
		title: 'SMPortal - Test Environment'
	},
	facebook: {
		clientID: process.env.FACEBOOK_ID || 'APP_ID',
		clientSecret: process.env.FACEBOOK_SECRET || 'APP_SECRET',
		callbackURL: '/auth/facebook/callback'
	},
	twitter: {
		clientID: process.env.TWITTER_KEY || 'CONSUMER_KEY',
		clientSecret: process.env.TWITTER_SECRET || 'CONSUMER_SECRET',
		callbackURL: '/auth/twitter/callback'
	},
	google: {
		clientID: process.env.GOOGLE_ID || 'APP_ID',
		clientSecret: process.env.GOOGLE_SECRET || 'APP_SECRET',
		callbackURL: '/auth/google/callback'
	},
	linkedin: {
		clientID: process.env.LINKEDIN_ID || 'APP_ID',
		clientSecret: process.env.LINKEDIN_SECRET || 'APP_SECRET',
		callbackURL: '/auth/linkedin/callback'
	},
	github: {
		clientID: process.env.GITHUB_ID || 'APP_ID',
		clientSecret: process.env.GITHUB_SECRET || 'APP_SECRET',
		callbackURL: '/auth/github/callback'
	},
	mailer: {
		from: process.env.MAILER_FROM || 'marjanovic.danijel@smithmicro.com',
		options: {
			service: process.env.MAILER_SERVICE_PROVIDER || 'ssl://smtp.googlemail.com',
			auth: {
				user: process.env.MAILER_EMAIL_ID || 'marjanovic.danijel@gmail.com',
				pass: process.env.MAILER_PASSWORD || 'sifra1234'
			}
		}
	}
};
