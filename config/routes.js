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
		this.get('/', 'basic#index');
		this.post('/', 'basic#signup');

		this.post('social', 'social#signup');

		this.get('twitter', passport.authenticate('twitter', {
			callbackURL: '/signup/twitter/callback/'
		}));
		this.get('twitter/callback', 'twitter#signup');
	});

	//404
	this.match('*', 'pages#notFound', {
		via: ['POST', 'GET']
	});