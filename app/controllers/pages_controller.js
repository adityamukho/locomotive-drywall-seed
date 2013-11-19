var locomotive = require('locomotive'),
	Controller = locomotive.Controller;

var PagesController = new Controller();

PagesController.index = defaultRender;
PagesController.about = defaultRender;

PagesController.notFound = function() {
	var self = this;
	var req = self.req;
	var res = self.res;
	var next = self.next;

	res.status(404);
	self.respond({
		'json': function() {
			res.json({
				error: 'Resource not found.'
			});
		},
		'html': function() {
			self.render('http/404');
		}
	});
};

PagesController.logout = function() {
	var self = this;
	var req = self.req;
	var res = self.res;
	var next = self.next;

	req.logout();
	self.redirect('/');
};

function defaultRender() {
	this.render();
}

module.exports = PagesController;