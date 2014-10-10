var rek = require('rekuire');

module.exports = function(app) {

	rek('appeals.api.js')(app);
	rek('pizzas.api.js')(app);
	rek('teams.api.js')(app);
	rek('members.api.js')(app);
	rek('problems.api.js')(app);
	rek('submissions.api.js')(app);
	
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