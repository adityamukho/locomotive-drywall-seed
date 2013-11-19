// Draw routes.  Locomotive's router provides expressive syntax for drawing
// routes, including support for resourceful routes, namespaces, and nesting.
// MVC routes can be mapped mapped to controllers using convenient
// `controller#action` shorthand.  Standard middleware in the form of
// `function(req, res, next)` is also fully supported.  Consult the Locomotive
// Guide on [routing](http://locomotivejs.org/guide/routing.html) for additional
// information.
var passport = require('passport');

module.exports = function routes() {
	//Basic pages
	this.root('pages#index');
	this.get('about', 'pages#about');

	//Contact
	this.get('contact', 'contact#index');
	this.post('contact', 'contact#sendMessage');

	//Signup
	this.namespace('signup', function() {
		this.get('/', 'signup#index');
		this.post('/', 'signup#signup');

		//social signup
		this.post('social', 'signup#signupSocial');
		this.get('twitter', passport.authenticate('twitter', {
			callbackURL: '/signup/twitter/callback/'
		}));
		this.get('twitter/callback', 'signup#signupTwitter');
		this.get('github', passport.authenticate('github', {
			callbackURL: '/signup/github/callback/'
		}));
		this.get('github/callback', 'signup#signupGitHub');
		this.get('facebook', passport.authenticate('facebook', {
			callbackURL: '/signup/facebook/callback/'
		}));
		this.get('facebook/callback', 'signup#signupFacebook');
	});

	//Login
	this.namespace('login', function() {
		this.get('/', 'login#index');
		this.post('/', 'login#login');
		this.get('forgot', 'login#forgot');
		this.post('forgot', 'login#send');
		this.get('reset', 'login#reset');
		this.get('reset/:token', 'login#reset');
		this.put('reset/:token', 'login#set');

		//social login
		this.get('twitter', passport.authenticate('twitter', {
			callbackURL: '/login/twitter/callback/'
		}));
		this.get('twitter/callback', 'login#loginTwitter');
		this.get('github', passport.authenticate('github', {
			callbackURL: '/login/github/callback/'
		}));
		this.get('github/callback', 'login#loginGitHub');
		this.get('facebook', passport.authenticate('facebook', {
			callbackURL: '/login/facebook/callback/'
		}));
		this.get('facebook/callback', 'login#loginFacebook');
	});

	//Logout
	this.get('logout', 'pages#logout');

	//Account
	this.namespace('account', function() {
		this.get('/', 'account#index');

		//account > verification
		this.get('verification', 'account#indexVerify');
		this.post('verification', 'account#resendVerification');
		this.get('verification/:token', 'account#verify');

		//account > settings
		this.get('settings', 'account#settings');
		this.put('settings', 'account#updateSettings');
		this.put('settings/identity', 'account#identity');
		this.put('settings/password', 'account#password');

		//account > settings > social
		this.get('settings/twitter/', passport.authenticate('twitter', {
			callbackURL: '/account/settings/twitter/callback/'
		}));
		this.get('settings/twitter/callback', 'account#connectTwitter');
		this.get('settings/twitter/disconnect', 'account#disconnectTwitter');
		this.get('settings/github/', passport.authenticate('github', {
			callbackURL: '/account/settings/github/callback/'
		}));
		this.get('settings/github/callback', 'account#connectGitHub');
		this.get('settings/github/disconnect', 'account#disconnectGitHub');
		this.get('settings/facebook', passport.authenticate('facebook', {
			callbackURL: '/account/settings/facebook/callback/'
		}));
		this.get('settings/facebook/callback', 'account#connectFacebook');
		this.get('settings/facebook/disconnect', 'account#disconnectFacebook');
	});

	//404 - Must be the last route to be defined!
	this.match('*', 'pages#notFound', {
		via: ['POST', 'GET', 'PUT', 'DELETE', 'HEAD', 'TRACE', 'OPTIONS', 'PATCH']
	});
};