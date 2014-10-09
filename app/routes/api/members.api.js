var rek = require('rekuire');
var _ = require('underscore');

var Team = rek('team.model.js');

module.exports = function(app) {

	app.get('/api/pizzas/:pizza_id', function(req, res) {

	});

	app.post('/api/members/post:teamId', function(req, res) {
		Team.findById(new ObjectId(req.params.teamId), function(err, team) {
			if (err)
				res.send(err);

			team.members = req.body.members;

			team.save(function(err, updatedTeam) {
				if (err)
					res.send(err);

				res.json(updatedTeam);
			});
		});
	});

	app.get('/api/members/sorted/:division', function(req, res) {
		Team.find({division: req.params.division}, function(err, teams) {
			if (err)
				res.send(err);

			var members = _.flatten(_.map(teams, function(team) {
				return team.members;
			}));

			members = _.sortBy(members, function(member) {
				return -member.writtenScore;
			});

			res.json(members);
		});
	});
}