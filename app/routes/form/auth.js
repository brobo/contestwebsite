var rek = require('rekuire');
var team = rek('teams.api');
var Team = rek('team.model');

var apis = rek('local.js');

module.exports = function(app) {
	authFail = function(data) {
		console.log(data);
	};
	
	app.post('/api/login', function(req, res) {
		if(req.body.teamNumber == -1) { // Forgive me of my hacks o lord
			if(req.body.password === "claire2014") {
				req.session.teamNumber = -1;
				res.redirect('/admin');
			} else
				res.redirect('/login');
			return;
		}

		team.login(req.body.teamNumber, req.body.password, function(body) {
			req.session.teamNumber = body.team.number;
			res.redirect('/overview');
		}, function(err) {
			console.log("Failed to login a team");
			req.session.error = "Failed to login - invalid password or team not created.";
			res.redirect('/login');
		});
	});
	
	app.post('/api/logout', function(req, res) {
		req.session.teamNumber = null;
		
		res.redirect('/login');
	});
	
	app.post('/api/register', function(req, res) {
		team.createAndSet(req.body, function(team) {
			console.log("Successfully created team " + team.number);
			req.session.teamNumber = team.number;
			res.redirect('/overview');
		}, function(err) {
			console.log("Failed to register - " + err);
			req.session.error = "Failed to register - team already created or another server error occured.";
			res.redirect('/login');
		});
	});

	// Pizza stuff
	app.post('/api/pizza/order', function(req, res) {
		if(!req.session.teamNumber){
			res.redirect('/login');
			return;
		}

		Team.findByNumber(req.session.teamNumber, function(err, team) {
			if(err) {
				req.session.error = "Error with ordering pizza - already paid or delivered.";
				res.redirect('/overview');
				return;
			}

			team.pizza.cheese = Math.abs(req.body.cheese);
			team.pizza.pepperoni = Math.abs(req.body.pepperoni);
			team.pizza.sausage = Math.abs(req.body.sausage);
			if(team.pizza.cheese + team.pizza.pepperoni + team.pizza.sausage == 0)
				team.pizza.ordered = false;
			else
				team.pizza.ordered = true;


			team.save();

			res.redirect('/overview');
		});
	});

	app.post('/api/pizza/pay', function(req, res) {
		if(!req.session.teamNumber) {
			res.redirect('/login');
			return;
		}

		if(req.session.teamNumber != -1) {
			res.redirect('/login');
			return;
		}

		Team.findByNumber(req.body.orderedBy, function(err, team) {
			if(err) {
				res.json({success: false, error: "Could not find team or similar!"});
				return;
			}

			if(!team) {
				res.json({success: false, error: "The team didn't exist!"});
				return;
			}

			team.pizza.paid = !team.pizza.paid;
			team.save();

			res.json({success: true})
		});
	}); 

	app.post('/api/updateWritten', function(req, res) {
		if (!req.session.teamNumber) {
			res.redirect('/login');
			return;
		}

		if (req.session.teamNumber != -1) {
			res.redirect('/login');
			return;
		}

		console.log(req.body);

		team.editScore(req.body.teamNumber, req.body.memberIndex, req.body.score, function() {
			res.redirect('/admin');
		}, function() {
			res.redirect('/admin');
		});
	});
};