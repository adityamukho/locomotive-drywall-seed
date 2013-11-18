var locomotive = require('locomotive'),
	Controller = locomotive.Controller;

var AccountController = new Controller();

AccountController.index = function() {
	this.render('account/index');
};

require('../../ext/account/verification')(AccountController);
require('../../ext/account/settings')(AccountController);

//Wildcard filter must be defined AFTER all action definitions!!
AccountController.before('*', function(next) {
	var req = this.req;
	var res = this.res;

	this.app.auth.ensureAuthenticated(req, res, next);
	this.app.auth.ensureAccount(req, res, next);
});

module.exports = AccountController;