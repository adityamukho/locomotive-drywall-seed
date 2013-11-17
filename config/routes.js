// Draw routes.  Locomotive's router provides expressive syntax for drawing
// routes, including support for resourceful routes, namespaces, and nesting.
// MVC routes can be mapped mapped to controllers using convenient
// `controller#action` shorthand.  Standard middleware in the form of
// `function(req, res, next)` is also fully supported.  Consult the Locomotive
// Guide on [routing](http://locomotivejs.org/guide/routing.html) for additional
// information.
module.exports = function routes() {
	//Basic pages
	this.root('pages#index');
	this.get('about', 'pages#about');

	//Contact
	this.get('contact', 'contact#index');
	this.post('contact', 'contact#sendMessage');

	//Signup
	this.get('signup', 'signup#index');
	this.post('signup', 'signup#signup');
}