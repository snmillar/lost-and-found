var config = require('../config');
var graph = require('fbgraph');

exports.login = function(req, res) {
	
	// we don't have a code yet
  // so we'll redirect to the oauth dialog
  if (!req.query.code) {
    var authUrl = graph.getOauthUrl({
        "client_id":     config.facebook.client_id
      , "redirect_uri":  config.facebook.redirect_uri
      , "scope":         config.facebook.scope
    });

    if (!req.query.error) { //checks whether a user denied the app facebook login/permissions
      res.redirect(authUrl);
    } else {  //req.query.error == 'access_denied'
      res.send('access denied');
    }
    return;
  }

  // code is set
  // we'll send that and get the access token
  graph.authorize({
      "client_id":      config.facebook.client_id
    , "redirect_uri":   config.facebook.redirect_uri
    , "client_secret":  config.facebook.client_secret
    , "code":           req.query.code
  }, function (err, facebookRes) {
    res.redirect('/loggedintofacebook');
  });
}

exports.view = function(req, res) {
	res.render('index', {facebook_auth: true, twitter_auth: false});
}