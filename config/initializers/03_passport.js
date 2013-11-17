var passport = require('passport');

module.exports = function(done) {
	var LocalStrategy = require('passport-local').Strategy,
		TwitterStrategy = require('passport-twitter').Strategy,
		GitHubStrategy = require('passport-github').Strategy,
		FacebookStrategy = require('passport-facebook').Strategy;

	passport.use(new LocalStrategy(
		function(username, password, done) {
			var conditions = {
				isActive: 'yes'
			};
			if (username.indexOf('@') === -1) {
				conditions.username = username;
			} else {
				conditions.email = username;
			}

			this.db.models.User.findOne(conditions, function(err, user) {
				if (err) {
					return done(err);
				}

				if (!user) {
					return done(null, false, {
						message: 'Unknown user'
					});
				}

				var encryptedPassword = this.db.models.User.encryptPassword(password);
				if (user.password !== encryptedPassword) {
					return done(null, false, {
						message: 'Invalid password'
					});
				}

				return done(null, user);
			});
		}
	));

	if (this.get('twitter-oauth-key')) {
		passport.use(new TwitterStrategy({
				consumerKey: this.get('twitter-oauth-key'),
				consumerSecret: this.get('twitter-oauth-secret')
			},
			function(token, tokenSecret, profile, done) {
				done(null, false, {
					token: token,
					tokenSecret: tokenSecret,
					profile: profile
				});
			}
		));
	}

	if (this.get('github-oauth-key')) {
		passport.use(new GitHubStrategy({
				clientID: this.get('github-oauth-key'),
				clientSecret: this.get('github-oauth-secret'),
				customHeaders: {
					"User-Agent": this.get('project-name')
				}
			},
			function(accessToken, refreshToken, profile, done) {
				done(null, false, {
					accessToken: accessToken,
					refreshToken: refreshToken,
					profile: profile
				});
			}
		));
	}

	if (this.get('facebook-oauth-key')) {
		passport.use(new FacebookStrategy({
				clientID: this.get('facebook-oauth-key'),
				clientSecret: this.get('facebook-oauth-secret')
			},
			function(accessToken, refreshToken, profile, done) {
				done(null, false, {
					accessToken: accessToken,
					refreshToken: refreshToken,
					profile: profile
				});
			}
		));
	}

	passport.serializeUser(function(user, done) {
		done(null, user._id);
	});

	passport.deserializeUser(function(id, done) {
		this.db.models.User.findOne({
			_id: id
		}).populate('roles.admin').populate('roles.account').exec(function(err, user) {
			if (user.roles && user.roles.admin) {
				user.roles.admin.populate("groups", function(err, admin) {
					done(err, user);
				});
			} else {
				done(err, user);
			}
		});
	});

	done();
};