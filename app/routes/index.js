module.exports = function(app) {

	require('./api/pizzas.js')(app);

	app.get('/', function(req, res) {
      res.send('Hello, world!');
    });

    app.get('/*', function(req, res) {
      res.send('Hello, world!');
    });

}