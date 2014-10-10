var rek = require('rekuire');
var _ = require('underscore');

var Team = rek('team.model.js');

module.exports = {

	create: function(teamId, body, success, fail) {
		Team.findById(new ObjectId(teamId), function(err, team) {
			if (err) {
				fail(err);
				return;
			}

			team.members = req.body.members;

			team.save(function(err, updatedTeam) {
				if (err) {
					fail(err);
					return;
				}

				success(updatedTeam);
			});
		});
	},

	getByDivision: function(division, success, fail) {
		Team.find({division: req.params.division}, function(err, teams) {
			if (err) {
				fail(err);
				return;
			}

			var members = _.flatten(_.map(teams, function(team) {
				return team.members;
			}));

			members = _.sortBy(members, function(member) {
				return -member.writtenScore;
			});

			success(members);
		});
	}
}
