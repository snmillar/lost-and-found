exports.view = function(req, res) {
	res.render('myitems', {facebook_auth: req.session.facebook, twitter_auth: req.session.twitter});
}