exports.view = function(req, res) {
	res.render('index', {facebook_auth: false, twitter_auth: false});
}