var rek = require('rekuire');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Problem = rek('problem.model.js');
var Team = rek('team.model.js');

var submissionSchema = new Schema({
	number: Number,
	teamId: Schema.Types.ObjectId,
	problemId: Schema.Types.ObjectId,
	time: {
		contest: Number,
		global: Number
	},
	source: String,
	judgement: String
});

submissionSchema.methods.denormalize = function() {
	Problem.findById(problemId, function(err, problem) {
		this.problem = problem;
	});

	Team.findById(teamId, function(err, team) {
		this.team = team;
	});
};

module.exports = mongoose.model('Submission', submissionSchema);
