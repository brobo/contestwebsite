var rek = require('rekuire');

module.exports = function(app) {

	rek('appeals.api.js')(app);
	rek('pizzas.api.js')(app);
	rek('teams.api.js')(app);
	rek('members.api.js')(app);
	rek('problems.api.js')(app);
	rek('submissions.api.js')(app);
	
	app.get('/', function(req, res) {
		res.render('login', { layout: false });
	});
	
	app.get('/login', function(req, res) {
		res.render('login', { layout: false });
	});
	
	app.get('/overview', function(req, res) {
	  res.render('overview');
	});
}