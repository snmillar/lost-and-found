var graph = require('fbgraph');

exports.view = function(req, res) {
	var data = { };
	data.facebook_auth = req.session.facebook;
	data.twitter_auth = req.session.twitter;
	if(typeof req.session.fbconfig != 'undefined'){
		graph.setAccessToken(req.session.fbconfig.access_token);
		graph.get("me?fields=picture,name,education,email", function(err, gres){
			data.picture = gres.picture.data.url;
			data.fullname = gres.name;
			data.education = gres.education;
			data.email = gres.email;
			console.log(gres);
			res.render('profile', data);
		});
		
	}else{
		console.log('req.session.fbconfig is undefined');
		res.render('profile', data);
	}
	
}