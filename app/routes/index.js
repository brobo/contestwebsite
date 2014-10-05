module.exports = function(app) {

	require('./api/pizzas.js')(app);
	require('./api/teams.js')(app);
	require('./api/problems.js')(app);

	app.get('/', function(req, res) {
      res.render('home', {'name' : 'Samuel Jones'});
    });
}