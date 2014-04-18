var graph = require('fbgraph');

exports.view = function(req, res) {
	var data = { };
	data.facebook_auth = req.session.facebook;
	data.twitter_auth = req.session.twitter;
	if(typeof req.session.fbconfig != 'undefined'){
		console.log('setting the access token');
		graph.setAccessToken(req.session.fbconfig.access_token);
		console.log('getting the info');
		graph.get("me", function(err, gres){
			console.log(gres);
		});

		console.log('getting specific info');
		var qres = graph.get("me?fields=name");
		data.fullname = qres.name;
	}else{
		console.log('req.session.fbconfig is undefined');
	}

	res.render('profile', data);
}