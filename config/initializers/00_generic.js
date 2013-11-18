module.exports = function() {
	// Any files in this directory will be `require()`'ed when the application
	// starts, and the exported function will be invoked with a `this` context of
	// the application itself.  Initializers are used to connect to databases and
	// message queues, and configure sub-systems such as authentication.

	// Async initializers are declared by exporting `function(done) { /*...*/ }`.
	// `done` is a callback which must be invoked when the initializer is
	// finished.  Initializers are invoked sequentially, ensuring that the
	// previous one has completed before the next one executes.

	//Auth middleware
	this.auth = {};

	this.auth.ensureAuthenticated = function(req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		}
		res.set('X-Auth-Required', 'true');
		res.redirect('/login/?returnUrl=' + encodeURIComponent(req.originalUrl));
	};

	this.auth.ensureAdmin = function(req, res, next) {
		if (req.user.canPlayRoleOf('admin')) {
			return next();
		}
		res.redirect('/');
	};

	this.auth.ensureAccount = function(req, res, next) {
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
}