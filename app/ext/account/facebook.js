var helper = require('./helper');

module.exports = function(AccountController) {
	AccountController.connectFacebook = function() {
		var self = this;
		var req = self.req;
		var res = self.res;
		var next = self.next;

		req._passport.instance.authenticate('facebook', {
			callbackURL: '/account/settings/facebook/callback/'
		}, function(err, user, info) {
			if (!info || !info.profile) {
				return self.redirect('/account/settings');
			}

			self.app.db.models.User.findOne({
				'facebook.id': info.profile.id,
				_id: {
					$ne: req.user.id
				}
			}, function(err, user) {
				if (err) {
					return next(err);
				}

				if (user) {
					helper.renderSettings(self, 'Another user has already connected with that Facebook account.');
				} else {
					self.app.db.models.User.findByIdAndUpdate(req.user.id, {
						facebook: info.profile._json
					}, function(err, user) {
						if (err) {
							return next(err);
						}

						self.redirect('/account/settings');
					});
				}
			});
		})(req, res, next);
	};

	AccountController.disconnectFacebook = function() {
		var self = this;
		var req = self.req;
		var res = self.res;
		var next = self.next;

		self.app.db.models.User.findByIdAndUpdate(req.user.id, {
			facebook: {
				id: undefined
			}
		}, function(err, user) {
			if (err) {
				return next(err);
			}

			self.redirect('/account/settings');
		});
	};
}: