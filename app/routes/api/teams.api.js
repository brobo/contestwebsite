var rek = require('rekuire');
var Team = rek('team.model.js');

var async = require('async');
var _ = require('underscore');

module.exports = function(app) {

	app.get('/api/teams/:team_id', function(req, res) {
		Team.findById(req.params.team_id, function(err, team) {
			if (err)
				res.send(err);

			if (!team) {
				res.json({});
			} else {
				team.denormalize(function(denormalized) {
					res.json(denormalized);
				});
			}
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

	app.get('/api/teams/sorted/:division', function(req, res) {
		Team.find({division: req.params.division}, function(err, teams) {
			if (err)
				res.send(err);

			async.map(teams, function(team, cb) {
				team.denormalize(function(denormalized) {
					denormalized.programmingScore = _.reduce(denormalized.submissions, function(memo, submission) {
						console.log(submission.judgement == 'CORRECT');
						return memo + (submission.judgement == 'CORRECT' ? 40 : 0);
					}, 0);
					denormalized.programming = _.reduce(denormalized.submissions, function(memo, submission) {
						if (!memo[submission.problemNumber])
							memo[submission.problemNumber] = {solved: false, incorrect: 0};

						if (submission.judgement == "CORRECT")
							memo[submission.problemNumber].solved = true;
						else
							memo[submission.problemNumber].incorrect++;

						return memo;
					}, {});
					denormalized.writtenScore = _.reduce(denormalized.members, function(memo, member) {
						return memo + member.writtenScore;
					}, 0);
					cb(null, denormalized);
				}, 1);
			}, function(err, transformed) {
				if (err)
					res.send(err);

				var sorted = _.sortBy(_.each(transformed, function(team) {
					team.totalScore = team.programmingScore + team.writtenScore;
				}), function(team) {
					return -(team.totalScore * 1440 + team.programmingScore);
				});

				res.json(sorted);
			});
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