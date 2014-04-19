var graph = require('fbgraph');
var Twit = require('twit');

exports.view = function(req, res) {
	var data = { };
	data.facebook_auth = req.session.facebook;
	data.twitter_auth = req.session.twitter;
	if(typeof req.session.fbconfig != 'undefined'){
		graph.setAccessToken(req.session.fbconfig.access_token);
		graph.get("me/posts?fields=message", function(err, gres){
			data.messages = gres.data;
			console.log(gres);
			res.render('myitems', data);
		});
		
	}else{
		console.log('req.session.fbconfig is undefined');

		if(typeof req.session.twitconfig != 'undefined'){
			var T = new Twit({
				consumer_key: req.session.twitconfig.consumer_key,
				consumer_secret: req.session.twitconfig.consumer_secret,
				access_token: req.session.twitconfig.access_token,
				access_token_secret: req.session.twitconfig.access_token_secret
			});
			T.get('statuses/user_timeline', function(err, reply){
				console.log(reply);
				data.tweets = reply;
				res.render('myitems', data);
			});
		}else{
			console.log('req.session.twitconfig is undefined');
			res.render('myitems', data);
		}
	}
	
}