'use strict';

module.exports = {
	db: 'mongodb://localhost/smportal-dev',
	app: {
		title: 'SMPortal - Development Environment'
	},
	facebook: {
		clientID: process.env.FACEBOOK_ID || '453259854843910',
		clientSecret: process.env.FACEBOOK_SECRET || 'c616b1eec2ac3743ae1dbd0b65d139f8',
		callbackURL: '/auth/facebook/callback'
	},
	twitter: {
		clientID: process.env.TWITTER_KEY || 'HUBqecagRfV16hfMsxAXXj3io',
		clientSecret: process.env.TWITTER_SECRET || '1Zsa0plEzDXNtySXgQQlXn1IVi9NlivKanNUj2Yoesp8MUlegZ',
		callbackURL: '/auth/twitter/callback'
	},
	google: {
		clientID: process.env.GOOGLE_ID || '36035335928-lgirkkh7aur2dillu8jl77u9jnmjb1ni.apps.googleusercontent.com',
		clientSecret: process.env.GOOGLE_SECRET || 'wxX6MhYctmF8Ync3mP-VbNwg',
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
		from: process.env.MAILER_FROM || 'MAILER_FROM',
		options: {
			service: process.env.MAILER_SERVICE_PROVIDER || 'MAILER_SERVICE_PROVIDER',
			auth: {
				user: process.env.MAILER_EMAIL_ID || 'MAILER_EMAIL_ID',
				pass: process.env.MAILER_PASSWORD || 'MAILER_PASSWORD'
			}
		}
	}
};
