'use strict';

var locomotive = require('locomotive'),
	Controller = locomotive.Controller;

var PagesController = new Controller();

PagesController.index = defaultRender(PagesController);
PagesController.about = defaultRender(PagesController);

PagesController.notFound = function() {
	var self = this;
	var req = self.req;
	var res = self.res;

	res.status(404);
	self.respond({
		'json': function() {
			res.json({
				error: 'Resource not found.'
			});
		},
		'html': function() {
			self.render('http/' + (req.url.indexOf('/admin') === 0 ? 'admin404' : '404'));
		}
	});
};

PagesController.logout = function() {
	var self = this;
	var req = self.req;

	req.logout();
	self.redirect('/');
};

function defaultRender(ctrl) {
	return function() {
		ctrl.render();
	};
}

module.exports = PagesController;