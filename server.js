var express = require('express'),
	rek = require('rekuire')
	mongoose = require('mongoose'),
	handlebars = require('express-handlebars'),
	autoIncrement = require('mongoose-auto-increment'),
	lessMiddleware = require('less-middleware');

var config = rek('app/config')();

var app = express();

app.configure(function() {
	app.use(express.static(__dirname + '/public'));
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(lessMiddleware(__dirname + '/public'));
});

app.engine('handlebars', handlebars({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

var conn = mongoose.connect(config.db.server + ':' + config.db.port + '/' + config.db.name);
autoIncrement.initialize(conn);
rek('app/routes')(app);

var server = app.listen(config.port, function() {
	console.log('Listening on port %d', server.address().port);
});
