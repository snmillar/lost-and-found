var graph = require('fbgraph');

exports.view = function(req, res) {
	var data = { };
	data.facebook_auth = req.session.facebook;
	data.twitter_auth = req.session.twitter;
	if(typeof req.session.fbconfig != 'undefined'){
		graph.setAccessToken(req.session.fbconfig.access_token);
		graph.get("me", function(err, res){
			console.log(res);
		});

		var qres = graph.get("me?fields=name");
	}

	res.render('profile', data);
}