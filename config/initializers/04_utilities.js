module.exports = function(done) {
	this.utility = {};
	this.utility.sendmail = require('../../utilities/sendmail');
	this.utility.slugify = require('../../utilities/slugify');
	this.utility.workflow = require('../../utilities/workflow');

	done();
};