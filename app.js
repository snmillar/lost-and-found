//dependencies for each module used
var express = require('express');
var http = require('http');
var path = require('path');
var handlebars = require('express3-handlebars');
var passport = require('passport');
var Twit = require('twit');

var dotenv = require('dotenv');
dotenv.load();
var config = { };
//should end in /
config.rootUrl = process.env.ROOT_URL	|| 'http://localhost:3000/';
config.twitter = {
	consumer_key: 		process.env.TWITTER_APPID,
	consumer_secret: 	process.env.TWITTER_APPSECRET,
	redirect_uri: 	config.rootUrl + 'auth/twitter/callback'
}
config.facebook = {
	client_id: 			process.env.FACEBOOK_APPID,
	client_secret: 		process.env.FACEBOOK_APPSECRET,
	redirect_uri: 	config.rootUrl + 'auth/facebook/callback'
};

var TwitterStrategy = require('passport-twitter').Strategy;
var FacebookStrategy = require('passport-facebook-canvas');

passport.serializeUser(function(user, done){
	done(null, user);
});
passport.deserializeUser(function(obj, done){
	done(null, obj);
});
var twitconfig = { };
passport.use(new TwitterStrategy({
	consumerKey: config.twitter.consumer_key,
	consumerSecret: config.twitter.consumer_secret,
	callbackURL: config.twitter.redirect_uri
  },
  function(token, tokenSecret, profile, done) {
  	process.nextTick(function(){
  		twitconfig = {
  			consumer_key: config.twitter.consumer_key,
  			consumer_secret: config.twitter.consumer_secret,
  			access_token: token,
  			access_token_secret: tokenSecret
  		};
  		return done(null, profile);
  	});
  }
));
var fbconfig = { };
passport.use(new FacebookStrategy({
	clientID: config.facebook.client_id,
	clientSecret: config.facebook.client_secret,
	callbackURL: config.facebook.redirect_uri
  },
  function(accessToken, refreshToken, profile, done) {
  	process.nextTick(function(){
  		fbconfig = {
  			access_token: accessToken
  		}
  		return done(null, profile);
  	});
  }
));

var app = express();


//route files to load
var index = require('./routes/index');
var myitems = require('./routes/myitems');
var profile = require('./routes/profile');

//database setup - uncomment to set up your database
//var mongoose = require('mongoose');
//mongoose.connect(process.env.MONGOHQ_URL || 'mongodb://localhost/DATABASE1);

//Configures the Template engine
app.engine('handlebars', handlebars());
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.methodOverride());
app.use(express.session({ secret: 'keyboard cat'}));
app.use(passport.initialize());

//routes
app.get('/', index.view);
app.get('/myitems', myitems.view);
app.get('/profile', profile.view);
app.get('/auth/facebook', passport.authenticate('facebook-canvas', { scope: ['email', 'user_about_me', 'user_education_history', 'user_likes', 'read_stream']}));
app.get('/auth/facebook/callback', passport.authenticate('facebook-canvas', { failureRedirect: '/error'}), function(req,res){
	req.session.facebook = true;
	req.session.fbconfig = fbconfig;
	res.redirect('/');
});
app.post('/auth/facebook/canvas', passport.authenticate('facebook-canvas', { failureRedirect: '/auth/facebook/canvas/autologin'}), function(req,res){
	req.session.facebook = true;
	req.session.fbconfig = fbconfig;
	res.redirect('/');
});
app.get('/auth/facebook/canvas/autologin', function(req,res){
	req.session.facebook = true;
	req.session.fbconfig = fbconfig;
	res.send('<!DOCTYPE html>' +
				'<body>' + 
					'<script type="text/javascript">' + 
						'top.location.href = "/auth/facebook";' +
					'</script>' +
				'</body>' +
			'</html>' );
});
app.get('/auth/twitter', passport.authenticate('twitter'));
app.get('/auth/twitter/callback', passport.authenticate('twitter', { failureRedirect: '/error' }), function(req,res){
	req.session.twitter = true;
	req.session.twitconfig = twitconfig;
	res.redirect('/');
});

//set environment ports and start application
app.set('port', process.env.PORT || 3000);
http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});