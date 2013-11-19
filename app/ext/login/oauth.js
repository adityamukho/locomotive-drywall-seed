module.exports = function(LoginController) {
	LoginController.loginTwitter = function() {
		var self = this;
		var req = self.req;
		var res = self.res;
		var next = self.next;

		req._passport.instance.authenticate('twitter', function(err, user, info) {
			if (!info || !info.profile) {
				return self.redirect('/login');
			}

			self.app.db.models.User.findOne({
				'twitter.id': info.profile.id
			}, function(err, user) {
				if (err) {
					return next(err);
				}

				if (!user) {
					self.returnUrl = self.param('returnUrl') || '/';
					self.oauthMessage = 'No users found linked to your Twitter account. You may need to create an account first.';
					self.oauthTwitter = !! self.app.get('twitter-oauth-key');
					self.oauthGitHub = !! self.app.get('github-oauth-key');
					self.oauthFacebook = !! self.app.get('facebook-oauth-key');
					self.render('login/index');
				} else {
					req.login(user, function(err) {
						if (err) {
							return next(err);
						}

						self.redirect(user.defaultReturnUrl());
					});
				}
			});
		})(req, res, next);
	};

	LoginController.loginGitHub = function() {
		var self = this;
		var req = self.req;
		var res = self.res;
		var next = self.next;

		req._passport.instance.authenticate('github', function(err, user, info) {
			if (!info || !info.profile) {
				return self.redirect('/login');
			}

			self.app.db.models.User.findOne({
				'github.id': info.profile.id
			}, function(err, user) {
				if (err) {
					return next(err);
				}

				if (!user) {
					self.returnUrl = self.param('returnUrl') || '/';
					self.oauthMessage = 'No users found linked to your GitHub account. You may need to create an account first.';
					self.oauthTwitter = !! self.app.get('twitter-oauth-key');
					self.oauthGitHub = !! self.app.get('github-oauth-key');
					self.oauthFacebook = !! self.app.get('facebook-oauth-key');
					self.render('login/index');
				} else {
					req.login(user, function(err) {
						if (err) {
							return next(err);
						}

						self.redirect(user.defaultReturnUrl());
					});
				}
			});
		})(req, res, next);
	};

	LoginController.loginFacebook = function() {
		var self = this;
		var req = self.req;
		var res = self.res;
		var next = self.next;

		req._passport.instance.authenticate('facebook', {
			callbackURL: '/login/facebook/callback/'
		}, function(err, user, info) {
			if (!info || !info.profile) {
				return self.redirect('/login');
			}

			self.app.db.models.User.findOne({
				'facebook.id': info.profile.id
			}, function(err, user) {
				if (err) {
					return next(err);
				}

				if (!user) {
					self.returnUrl = self.param('returnUrl') || '/';
					self.oauthMessage = 'No users found linked to your Facebook account. You may need to create an account first.';
					self.oauthTwitter = !! self.app.get('twitter-oauth-key');
					self.oauthGitHub = !! self.app.get('github-oauth-key');
					self.oauthFacebook = !! self.app.get('facebook-oauth-key');
					self.render('login/index');
				} else {
					req.login(user, function(err) {
						if (err) {
							return next(err);
						}

						self.redirect(user.defaultReturnUrl());
					});
				}
			});
		})(req, res, next);
	};
};