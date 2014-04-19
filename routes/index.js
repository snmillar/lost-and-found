var graph = require('fbgraph');

exports.view = function(req, res) {
	var data = { };
	data.facebook_auth = req.session.facebook;
	data.twitter_auth = req.session.twitter;
	if(typeof req.session.fbconfig != 'undefined'){
		graph.setAccessToken(req.session.fbconfig.access_token);
		graph.get("me/likes/576550345792910", function(err, gres){
			if(gres.data.length > 0){
				data.liked_page = true;
			}else{
				data.liked_page = false;
			}
			console.log(gres);
			res.render('index', data);
		});
		
	}else{
		console.log('req.session.fbconfig is undefined');
		res.render('index', data);
	}
}