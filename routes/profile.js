exports.view = function(req, res) {
	res.render('profile', {facebook_auth: req.session.facebook, twitter_auth: req.session.twitter});
}