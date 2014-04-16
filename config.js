var dotenv = require('dotenv');
dotenv.load();

var config = { };

//should end in /
config.rootUrl = process.env.ROOT_URL	|| 'http://localhost:3000/';

config.facebook = {
	client_id: 			process.env.FACEBOOK_APPID,
	client_secret: 		process.env.FACEBOOK_APPSECRET,
	appNamespace: 	process.env.FACEBOOK_APPNAMESPACE,
	scope: 			'email, user_about_me, user_education_history, user_groups, user_status, user_likes',
	redirect_uri: 	process.env.FACEBOOK_REDIRECTURI || config.rootUrl + 'auth/facebook'
};

module.exports = config;