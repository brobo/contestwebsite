var rek = require('rekuire');

module.exports = function(app) {

	rek('local.js');
	
	app.get('/', function(req, res) {
		res.render('login', { layout: false });
	});
	
	app.get('/login', function(req, res) {
		res.render('login', { layout: false });
	});
	
	app.get('/overview', function(req, res) {
		res.render('overview');
	});
	
	app.get('/admin', function(req, res) {
		res.render('admin');
	});
}