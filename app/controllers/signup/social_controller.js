var locomotive = require('locomotive'),
	Controller = locomotive.Controller;

var SocialController = new Controller();

SocialController.signup = function(req, res) {
	var self = this;
	var req = self.req;
	var res = self.res;
	
	var workflow = self.app.utility.workflow(req, res);

	workflow.on('validate', function() {
		if (!req.body.email) {
			workflow.outcome.errfor.email = 'required';
		} else if (!/^[a-zA-Z0-9\-\_\.\+]+@[a-zA-Z0-9\-\_\.]+\.[a-zA-Z0-9\-\_]+$/.test(req.body.email)) {
			workflow.outcome.errfor.email = 'invalid email format';
		}

		if (workflow.hasErrors()) {
			return workflow.emit('response');
		}

		workflow.emit('duplicateUsernameCheck');
	});

	workflow.on('duplicateUsernameCheck', function() {
		workflow.username = req.session.socialProfile.username;
		if (!/^[a-zA-Z0-9\-\_]+$/.test(workflow.username)) {
			workflow.username = workflow.username.replace(/[^a-zA-Z0-9\-\_]/g, '');
		}

		self.app.db.models.User.findOne({
			username: workflow.username
		}, function(err, user) {
			if (err) {
				return workflow.emit('exception', err);
			}

			if (user) {
				workflow.username = workflow.username + req.session.socialProfile.id;
			} else {
				workflow.username = workflow.username;
			}

			workflow.emit('duplicateEmailCheck');
		});
	});

	workflow.on('duplicateEmailCheck', function() {
		self.app.db.models.User.findOne({
			email: req.body.email
		}, function(err, user) {
			if (err) {
				return workflow.emit('exception', err);
			}

			if (user) {
				workflow.outcome.errfor.email = 'email already registered';
				return workflow.emit('response');
			}

			workflow.emit('createUser');
		});
	});

	workflow.on('createUser', function() {
		var fieldsToSet = {
			isActive: 'yes',
			username: workflow.username,
			email: req.body.email,
			search: [
				workflow.username,
				req.body.email
			]
		};
		fieldsToSet[req.session.socialProfile.provider] = req.session.socialProfile._json;

		self.app.db.models.User.create(fieldsToSet, function(err, user) {
			if (err) {
				return workflow.emit('exception', err);
			}

			workflow.user = user;
			workflow.emit('createAccount');
		});
	});

	workflow.on('createAccount', function() {
		var nameParts = req.session.socialProfile.displayName.split(' ');
		var fieldsToSet = {
			isVerified: 'yes',
			'name.first': nameParts[0],
			'name.last': nameParts[1] || '',
			'name.full': req.session.socialProfile.displayName,
			user: {
				id: workflow.user._id,
				name: workflow.user.username
			},
			search: [
				nameParts[0],
				nameParts[1] || ''
			]
		};
		self.app.db.models.Account.create(fieldsToSet, function(err, account) {
			if (err) {
				return workflow.emit('exception', err);
			}

			//update user with account
			workflow.user.roles.account = account._id;
			workflow.user.save(function(err, user) {
				if (err) {
					return workflow.emit('exception', err);
				}

				workflow.emit('sendWelcomeEmail');
			});
		});
	});

	workflow.on('sendWelcomeEmail', function() {
		self.app.utility.sendmail(req, res, {
			from: self.app.get('smtp-from-name') + ' <' + self.app.get('smtp-from-address') + '>',
			to: req.body.email,
			subject: 'Your ' + self.app.get('project-name') + ' Account',
			textPath: 'signup/email-text',
			htmlPath: 'signup/email-html',
			locals: {
				username: workflow.user.username,
				email: req.body.email,
				loginURL: 'http://' + req.headers.host + '/login/',
				projectName: self.app.get('project-name')
			},
			success: function(message) {
				workflow.emit('logUserIn');
			},
			error: function(err) {
				console.log('Error Sending Welcome Email: ' + err);
				workflow.emit('logUserIn');
			}
		});
	});

	workflow.on('logUserIn', function() {
		req.login(workflow.user, function(err) {
			if (err) {
				return workflow.emit('exception', err);
			}

			delete req.session.socialProfile;
			workflow.outcome.defaultReturnUrl = workflow.user.defaultReturnUrl();
			workflow.emit('response');
		});
	});

	workflow.emit('validate');
};

module.exports = SocialController;