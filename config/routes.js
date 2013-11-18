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
		this.post('social', 'signup#socialSignup');

		this.get('twitter', passport.authenticate('twitter', {
			callbackURL: '/signup/twitter/callback/'
		}));
		this.get('twitter/callback', 'twitter#signup');
	});

	//Account
	this.namespace('account', function() {
		this.get('/', 'account#index');
		this.get('verification', 'account#indexVerify');
		this.post('verification', 'account#resendVerification');
		this.get('verification/:token', 'account#verify');
	});

	//404 - Must be the last route to be defined!
	this.match('*', 'pages#notFound', {
		via: ['POST', 'GET']
	});
};