exports.view = function(req, res) {
	res.render('index', {facebook_auth: req.session.facebook, twitter_auth: req.session.twitter});
}