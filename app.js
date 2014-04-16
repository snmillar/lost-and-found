//dependencies for each module used
var express = require('express');
var http = require('http');
var path = require('path');
var handlebars = require('express3-handlebars');
var passport = require('passport');

var dotenv = require('dotenv');
dotenv.load();
var config = { };
//should end in /
config.rootUrl = process.env.ROOT_URL	|| 'http://lostandfounducsd.herokuapp.com/';
config.twitter = {
	consumer_key: 		process.env.TWITTER_APPID,
	consumer_secret: 	process.env.TWITTER_APPSECRET,
	access_token: 		process.env.TWITTER_ACCESSTOKEN,
	access_token_secret: 	process.env.TWITTER_ACCESSSECRET,
	redirect_uri: 	config.rootUrl + 'loggedintotwitter'
}

var TwitterStrategy = require('passport-twitter').Strategy;

passport.serializeUser(function(user, done){
	done(null, user);
});
passport.deserializeUser(function(obj, done){
	done(null, obj);
});
passport.use(new TwitterStrategy({
	consumerKey: config.twitter.consumer_key,
	consumerSecret: config.twitter.consumer_secret,
	callbackURL: config.twitter.redirect_uri
  },
  function(token, tokenSecret, profile, done) {
  	process.nextTick(function(){
  		return done(null, profile);
  	});
  }
));

var app = express();


//route files to load
var index = require('./routes/index');
var fb_auth = require('./routes/fb_auth');
var twit_auth = require('./routes/twit_auth');

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
app.get('/auth/facebook', fb_auth.login);
app.get('/loggedintofacebook', fb_auth.view);
app.get('/auth/twitter', passport.authenticate('twitter'), function(req,res){});
app.get('/loggedintotwitter', passport.authenticate('twitter', {failureRedirect: '/loggedintofacebook' }), twit_auth.view);

//set environment ports and start application
app.set('port', process.env.PORT || 3000);
http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});