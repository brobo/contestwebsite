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
		team.divison = body.division;

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

	createAndSet: function(body, success, fail) {
		var test = {};

		test.number = body.teamNumber;
		test.school = body.school;
		test.division = body.division;

		test.members = [];
		for(var x = 0; x < body.members.length; x++) {
			if(body.members[x]) {
				test.members[x] = {
					name: body.members[x],
					writtenScore: 0
				};
			}
		}

		if(body.cpassword) {
			if(body.cpassword !== body.password) {
				fail(new Error("The password and password confirmation do not match!"));
				return;
			}
		}

		test.password = body.password; // Still not sorry.

		console.log(test);

		Team.create(test, function(err, obj) {
			if(err) { fail(err); return; }

			success(obj);
		});
	},

	setMembers: function(teamNumber, body, success, fail) {
		Team.findByNumber(teamNumber, function(err, team) {
			if (err) {
				fail(err);
				return;
			}

			if(team.password !== null) {
				fail(new Error("The password has already been set!"));
				return;
			}

			team.members = [];
			team.members[0].name = body.members[0];
			team.members[1].name = body.members[1];
			team.members[2].name = body.members[2];

			team.password = body.password; // I'm sorry, don't kill me.

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

			if(!team) {
				fail(new Error("Could not find a team with this number."));
				return;
			}

			if (team.password === password) {
				success({ success: true, team: team });
			} else {
				fail(new Error("Invalid password for this team."));
			}
		})
	},

	update: function(teamNumber, body, success, fail) {
		Team.findByNumber(teamNumber, function(err, team) {
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
	},

	editScore: function(teamNumber, memberIndex, score, success, fail) {
		Team.findByNumber(teamNumber, function(err, resteam) {
			if (err) {
				fail(err);
				return;
			}

			if(!resteam) {
				fail(new Error("Team doesn't exist"));
				return;
			}

			resteam.members[memberIndex].writtenScore = score;
			resteam.save(function(err, updatedTeam) {
				if (err) {
					fail(err);
					return;
				}

				success(updatedTeam);
			});
		});
	}
}
