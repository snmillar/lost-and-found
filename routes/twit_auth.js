exports.view = function(req, res) {
	res.render('index', {facebook_auth: true, twitter_auth: true});
}