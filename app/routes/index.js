var rek = require('rekuire');
var Team = rek('team.model.js');
var async = require('async');

module.exports = function(app) {

	rek('local.js');
	rek('auth.js')(app);
	
	app.get('/', function(req, res) {
		if(req.session.teamNumber)
			res.render('overview');
		else
			res.render('login', { error: req.session.error});
	});
	
	app.get('/login', function(req, res) {
		res.render('login', { error: req.session.error, teamNumber: req.session.teamNumber });
	});

	app.get('/logout', function(req, res) {
		req.session.teamNumber = null;

		res.redirect('/login');
	});
	
	app.get('/overview', function(req, res) {
		if(!req.session.teamNumber) {
			res.redirect('/login');
			return;
		}

		Team.findByNumber(req.session.teamNumber, function(err, team) { 
			if(err) {
				res.render('login', {error: "Your team doesn't seem to exist anymore!" });
				return;
			}

			team.denormalize(function(realTeam) {
				var context = {
					teamNumber: req.session.teamNumber,
					team: realTeam
				 };

				 if(!context.team.pizza.paid)
				 	context.team.pizza.amountDue = (context.team.pizza.cheese + context.team.pizza.pepperoni + context.team.pizza.sausage) * 12;

				 for (var i = 0; i < context.team.members.length; i++) {
				 	context.team.members[i].cid = context.team.number * 3 + i;
				 };

		  		res.render('overview', context);
	  		});
	  	});
	});
}