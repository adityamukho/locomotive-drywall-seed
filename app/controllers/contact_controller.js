var locomotive = require('locomotive'),
	Controller = locomotive.Controller;

var ContactController = new Controller();

ContactController.index = defaultRender;

ContactController.sendMessage = function() {
	var self = this;
	var req = self.req;
	var res = self.res;

	var workflow = self.app.utility.workflow(req, res);

	workflow.on('validate', function() {
		if (!req.body.name) {
			workflow.outcome.errfor.name = 'required';
		}

		if (!req.body.email) {
			workflow.outcome.errfor.email = 'required';
		}

		if (!req.body.message) {
			workflow.outcome.errfor.message = 'required';
		}

		if (workflow.hasErrors()) {
			return workflow.emit('response');
		}

		workflow.emit('sendEmail');
	});

	workflow.on('sendEmail', function() {
		self.app.utility.sendmail(req, res, {
			from: req.app.get('smtp-from-name') + ' <' + req.app.get('smtp-from-address') + '>',
			replyTo: req.body.email,
			to: req.app.get('system-email'),
			subject: req.app.get('project-name') + ' contact form',
			textPath: 'contact/email-text',
			htmlPath: 'contact/email-html',
			locals: {
				name: req.body.name,
				email: req.body.email,
				message: req.body.message,
				projectName: req.app.get('project-name')
			},
			success: function(message) {
				workflow.emit('response');
			},
			error: function(err) {
				workflow.outcome.errors.push('Error Sending: ' + err);
				workflow.emit('response');
			}
		});
	});

	workflow.emit('validate');
};


function defaultRender() {
	this.render();
}

module.exports = ContactController;