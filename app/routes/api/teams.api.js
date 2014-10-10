var rek = require('rekuire');
var Team = rek('team.model.js');

var async = require('async');
var _ = require('underscore');
var bcrypt = require('bcrypt-nodejs');

module.exports = {
	getById: function(id, success, fail) {
		Team.findById(id, function(err, team) {
			if (err) {
				fail(err);
				return;
			}

			if (!team) {
				success({});
			} else {
				team.denormalize(function(denormalized) {
					success(denormalized);
				});
			}
		});
	},

	get: function(success, fail) {
		Team.find(function(err, teams) {
			if (err) {
				fail(err);
				return;
			}

			var processed = [];

			function loopAsync(i) {
				if (i == teams.length) {
					success(processed);
				} else {
					teams[i].denormalize(function(denormalized) { 
						processed[i] = denormalized;
						loopAsync(i+1) 
					});
				}
			}

			loopAsync(0);
		});
	},

	getByDivision: function(division, success, fail) {
		Team.find({division: division}, function(err, teams) {
			if (err) {
				fail(err);
				return;
			}

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
				if (err) {
					fail(err);
					return;
				}

				var sorted = _.sortBy(_.each(transformed, function(team) {
					team.totalScore = team.programmingScore + team.writtenScore;
				}), function(team) {
					return -(team.totalScore * 1440 + team.programmingScore);
				});

				success(sorted);
			});
		});
	},

	create: function(body, success, fail) {
		var team = new Team();

		team.school = body.school;

		team.save(function(err, updatedTeam) {
			if (err) {
				fail(err);
				return;
			}

			updatedTeam.denormalize(function(denormalized) {
				success(denormalized);
			});
		});
	},

	setMembers: function(teamId, body, success, fail) {
		Team.findById(teamId, function(err, team) {
			if (err) {
				fail(err);
				return;
			}

			team.members = [];
			team.members[0].name = body.members[0];
			team.members[1].name = body.members[1];
			team.members[2].name = body.members[2]; 

			team.password = bcrypt.hashSync(body.password, 10);

			team.save(function(err, updatedTeam) {
				if (err) {
					fail(err);
					return;
				}

				updatedTeam.denormalize(function(denormalized) {
					success(denormalized);
				});
			});
		});
	},

	login: function(teamNumber, password, success, fail) {
		Team.findByNumber(teamNumber, function(err, team) {
			if (err) {
				fail(err);
				return;
			}

			if (bcrypt.checkHashSync(team.password, password)) {
				success({success: true});
			} else {
				success({success: false});
			}
		})
	},

	update: function(id, body, success, fail) {
		Team.findById(id, function(err, team) {
			if (err) {
				fail(err);
				return;
			}

			team.members = team.members || [];
			team.members[0].name = body.members[0] || team.members[0].name;
			team.members[1].name = body.members[1] || team.members[1].name;
			team.members[2].name = body.members[2] || team.members[2].name; 

			team.save(function(err, updatedTeam) {
				if (err) {
					fail(err);
					return;
				}

				updatedTeam.denormalize(function(denormalized) {
					success(denormalized);
				});
			});
		});
	},

	delete: function(id, success, fail) {
		Team.remove({
			_id : id
		}, function(err, team) {
			if (err) {
				fail(err);
				return;
			}

			success(team);
		});
	},

	getSchools: function(success, fail) {
		Team.find(function(err, teams) {
			if (err) {
				fail(err);
				return;
			}

			var arr = _.reduce(teams, function(memo, team) {
				memo[team.number] = team.school;
				return memo;
			}, {});

			success(arr);
		});
	}
}
