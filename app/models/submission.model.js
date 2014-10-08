var rek = require('rekuire');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Types.ObjectId;

var Problem = rek('problem.model.js');

var submissionSchema = new Schema({
	number: Number,
	teamId: Schema.Types.ObjectId,
	problemNumber: Number,
	time: {
		contest: Number,
		global: Number
	},
	source: String,
	judgement: String
});

submissionSchema.methods.denormalize = function(callback, recurse) {
	if (recurse == 0) {
		callback(this);
		return;
	}
	recurse = recurse || 2;

	var Team = rek('team.model.js');

	var submission = this.toObject();

	Problem.findByNumber(submission.problemNumber, function(err, problem) {
		submission.problem = problem;

		console.log(submission);

		Team.findById(submission.teamId, function(err, team) {
			if (!team) {
				callback(submission);
				return;
			}
			team.denormalize(function(denormalized) {
				submission.team = denormalized;
				callback(submission);
			}, recurse-1);
		});
	});
};

module.exports = mongoose.model('Submission', submissionSchema);
