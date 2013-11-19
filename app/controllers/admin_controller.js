var locomotive = require('locomotive'),
	Controller = locomotive.Controller;

var AdminController = new Controller();

AdminController.index = function() {
	var self = this;
	var req = self.req;
	var res = self.res;
	var next = self.next;

	var collections = ['User', 'Account', 'Admin', 'AdminGroup', 'Category', 'Status'];
	var queries = [];

	collections.forEach(function(el, i, arr) {
		queries.push(function(done) {
			self.app.db.models[el].count({}, function(err, count) {
				if (err) {
					return done(err, null);
				}

				self['count' + el] = count;
				done(null, el);
			});
		});
	});

	var asyncFinally = function(err, results) {
		if (err) {
			return next(err);
		}

		self.render();
	};

	require('async').parallel(queries, asyncFinally);
};

module.exports = AdminController;