var rek = require('rekuire');

module.exports = function(app) {

	rek('pizzas.api.js')(app);
	rek('teams.api.js')(app);
	rek('problems.api.js')(app);

	app.get('/', function(req, res) {
      res.render('home', {'name' : 'Samuel Jones'});
    });
}