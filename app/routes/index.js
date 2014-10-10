var rek = require('rekuire');

module.exports = function(app) {

	rek('local.js');
	
	app.get('/', function(req, res) {
		res.sendfile('views/login.html');
	});
	
	app.get('/login', function(req, res) {
		res.render('views/login.html');
	});
	
	app.get('/overview', function(req, res) {
	  res.render('overview');
	});
}