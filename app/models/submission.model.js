var rek = require('rekuire');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

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

	console.log("type is " + (typeof submission.problemNumber));

	Problem.findByNumber(submission.problemNumber, function(err, problem) {
		console.log(err);
		console.log("problem is: ");
		console.log(problem);
		submission.problem = problem;

		Team.findById(submission.teamId, function(err, team) {
			team.denormalize(function(denormalized) {
				submission.team = denormalized;
				callback(submission);
			}, recurse-1);
		});
	});
};

module.exports = mongoose.model('Submission', submissionSchema);
