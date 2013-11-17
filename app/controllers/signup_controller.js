var locomotive = require('locomotive'),
	Controller = locomotive.Controller;

var SignupController = new Controller();

SignupController.index = function() {
	this.oauthMessage = '';
	this.oauthTwitter = !! this.app.get('twitter-oauth-key');
	this.oauthGitHub = !! this.app.get('github-oauth-key');
	this.oauthFacebook = !! this.app.get('facebook-oauth-key');

	this.render();
};
SignupController.about = defaultRender;

function defaultRender() {
	this.render();
}

module.exports = SignupController;