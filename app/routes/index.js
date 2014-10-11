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
			res.render('login', { layout: false, error: req.session.error});
	});
	
	app.get('/login', function(req, res) {
		res.render('login', { layout: false, error: req.session.error, teamNumber: req.session.teamNumber });
	});

	app.get('/logout', function(req, res) {
		req.session.teamNumber = null;

		res.redirect('/login');
	});

	/*app.get('/scoreboard', function(req, res) {
		if (req.session.teamNumber)
			res.render('scoreboard');
		else
			res.redirect('/login');
	});*/

	app.get('/admin', function(req, res) {
		if(!req.session.teamNumber || req.session.teamNumber != -1)
			res.redirect('/login');
		else {
			Team.find({}, function(err, basicTeams) {
				async.map(basicTeams, function(basicTeam, callback) { 
					basicTeam.denormalize(function(res) {
						callback(null, res);
					});
				}, function(err, teams) {
					var pizzaStats = {
						cheese: 0,
						pepperoni: 0,
						sausage: 0
					};

					for(var x = 0; x < teams.length; x++)
					{
						if(!teams[x].pizza.paid) continue;
						pizzaStats.cheese += teams[x].pizza.cheese;
						pizzaStats.pepperoni = teams[x].pizza.pepperoni;
						pizzaStats.sausage = teams[x].pizza.sausage;
					}

					pizzaStats.total = (pizzaStats.cheese + pizzaStats.pepperoni + pizzaStats.sausage);
					pizzaStats.cost = pizzaStats.total * 12;

					res.render('admin', { teams: teams, pizza: pizzaStats });
				});
			});
		}
	});
	
	app.get('/overview', function(req, res) {
		if(!req.session.teamNumber || req.session.teamNumber == -1) {
			res.redirect('/login');
			return;
		}

		Team.findByNumber(req.session.teamNumber, function(err, team) { 
			if(err) {
				res.render('login', {layout: false, error: "Your team doesn't seem to exist anymore!" });
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