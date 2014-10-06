var rek = require('rekuire');
var Team = rek('team.model.js');

module.exports = function(app) {

	app.get('/api/teams/:team_id', function(req, res) {
		Team.findById(req.params.team_id, function(err, team) {
			if (err)
				res.send(err);

			team.denormalize(function(denormalized) {
				res.json(denormalized);
			});
		});
	});

	app.get('/api/teams', function(req, res) {
		Team.find(function(err, teams) {
			if (err)
				res.send(err);

			var processed = [];

			function loopAsync(i) {
				if (i == teams.length) {
					res.json(processed);
				} else {
					teams[i].denormalize(function(denormalized) { 
						processed[i] = denormalized;
						loopAsync(i+1) 
					});
				}
			}

			loopAsync(0);
		});
	});

	app.post('/api/teams', function(req, res) {
		var team = new Team();

		team.school = req.body.school; 

		team.save(function(err, updatedTeam) {
			if (err)
				res.send(err);

			updatedTeam.denormalize(function(denormalized) {
				res.json(denormalized);
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

				updatedTeam.denormalize(function(denormalized) {
					res.json(denormalized);
				});
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