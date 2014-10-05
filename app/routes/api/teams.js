var Team = require('../../models/team');

module.exports = function(app) {

	app.get('/api/teams/:team_id', function(req, res) {
		Team.findById(req.params.team_id, function(err, team) {
			if (err)
				res.send(err);

			team.denormalize();

			res.json(team);
		});
	});

	app.get('/api/teams', function(req, res) {
		Team.find(function(err, teams) {
			if (err)
				res.send(err);

			for (var i=0; i<teams.length; i++)
				teams[i].denormalize();

			res.json(teams);
		});
	});

	app.post('/api/teams', function(req, res) {
		var team = new Team();

		team.school = req.body.school; 

		team.save(function(err, updatedTeam) {
			if (err)
				res.send(err);

			res.json(updatedTeam);
		});
	});

	app.put('/api/pizzas/:pizza_id', function(req, res) {
		Team.findById(req.params.pizza_id, function(err, pizza) {

			if (err)
				res.send(err);

			pizza.name = req.body.name || pizza.name;
			pizza.price = req.body.price || pizza.price;

			pizza.save(function(err, updatedTeam) {
				if (err)
					res.send(err);

				res.json(updatedTeam);
			});
		});
	});

	app.put('/api/teams/:team_id', function(req, res) {
		Team.findById(req.params.team_id, function(err, team) {
			if (err)
				res.send(err);

			team.school = req.body.school || team.school;
			team.members = req.body.members || team.members;

			team.save(function(err, updatedTeam) {
				if (err)
					res.send(err);

				res.json(updateTeam);
			});
		});
	});

	app.delete('/api/teams/:team_id', function(req, res) {
		Team.remove({
			_id : req.params.team_id
		}, function(err, team) {
			if (err)
				res.send(err);

			req.json(team);
		});
	});
}