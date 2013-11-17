var locomotive = require('locomotive'),
	Controller = locomotive.Controller;

var PagesController = new Controller();

PagesController.index = defaultRender;
PagesController.about = defaultRender;

function defaultRender() {
	this.render();
}

module.exports = PagesController;