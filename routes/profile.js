var graph = require('fbgraph');

exports.view = function(req, res) {
	var data = { };
	data.facebook_auth = req.session.facebook;
	data.twitter_auth = req.session.twitter;
	if(typeof req.session.fbconfig != 'undefined'){
		graph.setAccessToken(req.session.fbconfig.access_token);
		graph.get("me", function(err, gres){
			console.log(gres);
		});

		var qres = graph.get("me?fields=name");
	}else{
		console.log('req.session.fbconfig is undefined');
	}

	res.render('profile', data);
}