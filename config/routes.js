// Draw routes.  Locomotive's router provides expressive syntax for drawing
// routes, including support for resourceful routes, namespaces, and nesting.
// MVC routes can be mapped mapped to controllers using convenient
// `controller#action` shorthand.  Standard middleware in the form of
// `function(req, res, next)` is also fully supported.  Consult the Locomotive
// Guide on [routing](http://locomotivejs.org/guide/routing.html) for additional
// information.

var passport = require('passport');

var ensureAuthenticated = function(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.set('X-Auth-Required', 'true');
	res.redirect('/login/?returnUrl=' + encodeURIComponent(req.originalUrl));
};

var ensureAdmin = function(req, res, next) {
	if (req.user.canPlayRoleOf('admin')) {
		return next();
	}
	res.redirect('/');
};

var ensureAccount = function(req, res, next) {
	if (req.user.canPlayRoleOf('account')) {
		if (req.app.get('require-account-verification')) {
			if (req.user.roles.account.isVerified !== 'yes' && !/^\/account\/verification\//.test(req.url)) {
				return res.redirect('/account/verification/');
			}
		}
		return next();
	}
	res.redirect('/');
};

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
	this.post('signup/social', 'signup#signupSocial');
	this.namespace('signup', function() {
		//social signup
		this.get('twitter', passport.authenticate('twitter', {
			callbackURL: '/signup/twitter/callback/'
		}));
		this.get('twitter/callback', 'oauth#signupTwitter');
		this.get('github', passport.authenticate('github', {
			callbackURL: '/signup/github/callback/'
		}));
		this.get('github/callback', 'oauth#signupGitHub');
		this.get('facebook', passport.authenticate('facebook', {
			callbackURL: '/signup/facebook/callback/'
		}));
		this.get('facebook/callback', 'oauth#signupFacebook');
	});

	//Login
	this.get('login', 'login#index');
	this.post('login', 'login#login');
	this.namespace('login', function() {
		this.get('forgot', 'forgot#index');
		this.post('forgot', 'forgot#send');
		this.get('reset', 'reset#index');
		this.get('reset/:token', 'reset#index');
		this.put('reset/:token', 'reset#set');

		//social login
		this.get('twitter', passport.authenticate('twitter', {
			callbackURL: '/login/twitter/callback/'
		}));
		this.get('twitter/callback', 'oauth#loginTwitter');
		this.get('github', passport.authenticate('github', {
			callbackURL: '/login/github/callback/'
		}));
		this.get('github/callback', 'oauth#loginGitHub');
		this.get('facebook', passport.authenticate('facebook', {
			callbackURL: '/login/facebook/callback/'
		}));
		this.get('facebook/callback', 'oauth#loginFacebook');
	});

	//Logout
	this.get('logout', 'pages#logout');

	//Admin
	this.match('admin/*', ensureAuthenticated);
	this.match('admin/*', ensureAdmin);
	this.get('admin', 'admin#index');
	this.namespace('admin', function() {

		// //admin > users
		// this.get('users', require('./views/admin/users/index').find);
		// this.post('users', require('./views/admin/users/index').create);
		// this.get('users/:id', require('./views/admin/users/index').read);
		// this.put('users/:id', require('./views/admin/users/index').update);
		// this.put('users/:id/password', require('./views/admin/users/index').password);
		// this.put('users/:id/role-admin', require('./views/admin/users/index').linkAdmin);
		// this.delete('users/:id/role-admin', require('./views/admin/users/index').unlinkAdmin);
		// this.put('users/:id/role-account', require('./views/admin/users/index').linkAccount);
		// this.delete('users/:id/role-account', require('./views/admin/users/index').unlinkAccount);
		// this.delete('users/:id', require('./views/admin/users/index').delete);

		// //admin > administrators
		// this.get('administrators', require('./views/admin/administrators/index').find);
		// this.post('administrators', require('./views/admin/administrators/index').create);
		// this.get('administrators/:id', require('./views/admin/administrators/index').read);
		// this.put('administrators/:id', require('./views/admin/administrators/index').update);
		// this.put('administrators/:id/permissions', require('./views/admin/administrators/index').permissions);
		// this.put('administrators/:id/groups', require('./views/admin/administrators/index').groups);
		// this.put('administrators/:id/user', require('./views/admin/administrators/index').linkUser);
		// this.delete('administrators/:id/user', require('./views/admin/administrators/index').unlinkUser);
		// this.delete('administrators/:id', require('./views/admin/administrators/index').delete);

		// //admin > admin groups
		// this.get('admin-groups', require('./views/admin/admin-groups/index').find);
		// this.post('admin-groups', require('./views/admin/admin-groups/index').create);
		// this.get('admin-groups/:id', require('./views/admin/admin-groups/index').read);
		// this.put('admin-groups/:id', require('./views/admin/admin-groups/index').update);
		// this.put('admin-groups/:id/permissions', require('./views/admin/admin-groups/index').permissions);
		// this.delete('admin-groups/:id', require('./views/admin/admin-groups/index').delete);

		// //admin > accounts
		// this.get('accounts', require('./views/admin/accounts/index').find);
		// this.post('accounts', require('./views/admin/accounts/index').create);
		// this.get('accounts/:id', require('./views/admin/accounts/index').read);
		// this.put('accounts/:id', require('./views/admin/accounts/index').update);
		// this.put('accounts/:id/user', require('./views/admin/accounts/index').linkUser);
		// this.delete('accounts/:id/user', require('./views/admin/accounts/index').unlinkUser);
		// this.post('accounts/:id/notes', require('./views/admin/accounts/index').newNote);
		// this.post('accounts/:id/status', require('./views/admin/accounts/index').newStatus);
		// this.delete('accounts/:id', require('./views/admin/accounts/index').delete);

		// //admin > statuses
		// this.get('statuses', require('./views/admin/statuses/index').find);
		// this.post('statuses', require('./views/admin/statuses/index').create);
		// this.get('statuses/:id', require('./views/admin/statuses/index').read);
		// this.put('statuses/:id', require('./views/admin/statuses/index').update);
		// this.delete('statuses/:id', require('./views/admin/statuses/index').delete);

		// //admin > categories
		// this.get('categories', require('./views/admin/categories/index').find);
		// this.post('categories', require('./views/admin/categories/index').create);
		// this.get('categories/:id', require('./views/admin/categories/index').read);
		// this.put('categories/:id', require('./views/admin/categories/index').update);
		// this.delete('categories/:id', require('./views/admin/categories/index').delete);

		// //admin > search
		// this.get('search', require('./views/admin/search/index').find);
	});

	//Account
	this.match('account/*', ensureAuthenticated);
	this.match('account/*', ensureAccount);
	this.get('account/', 'account#index');
	this.namespace('account', function() {
		//account > verification
		this.get('verification', 'verification#index');
		this.post('verification', 'verification#resendVerification');
		this.get('verification/:token', 'verification#verify');

		//account > settings
		this.get('settings', 'settings#settings');
		this.put('settings', 'settings#update');
		this.put('settings/identity', 'settings#identity');
		this.put('settings/password', 'settings#password');

		//account > settings > social
		this.get('settings/twitter/', passport.authenticate('twitter', {
			callbackURL: '/account/settings/twitter/callback/'
		}));
		this.get('settings/twitter/callback', 'twitter#connectTwitter');
		this.get('settings/twitter/disconnect', 'twitter#disconnectTwitter');
		this.get('settings/github/', passport.authenticate('github', {
			callbackURL: '/account/settings/github/callback/'
		}));
		this.get('settings/github/callback', 'github#connectGitHub');
		this.get('settings/github/disconnect', 'github#disconnectGitHub');
		this.get('settings/facebook', passport.authenticate('facebook', {
			callbackURL: '/account/settings/facebook/callback/'
		}));
		this.get('settings/facebook/callback', 'facebook#connectFacebook');
		this.get('settings/facebook/disconnect', 'facebook#disconnectFacebook');
	});

	//404 - Must be the last route to be defined!
	this.match('*', 'pages#notFound', {
		via: ['POST', 'GET', 'PUT', 'DELETE', 'HEAD', 'TRACE', 'OPTIONS', 'PATCH']
	});
};