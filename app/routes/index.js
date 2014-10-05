module.exports = function(app) {

	require('./api/pizzas.js')(app);

	app.get('/', function(req, res) {
      res.render('home', {'name' : 'Samuel Jones'});
    });
}