var rek = require('rekuire');
var _ = require('underscore');

var Submission = rek('submission.model.js');
var Team = rek('team.model.js');

var ObjectId = require('mongoose').Types.ObjectId;

module.exports = {
	getById: function(id, success, fail) {
		Submission.findById(new ObjectId(id), function(err, submission) {
			if (err) {
				fail(err);
				return;
			}

			submission.denormalize(function(denormalized) {
				success(denormalized);
			});
		});
	},

	get: function(success, fail) {
		Submission.find(function(err, submissions) {
			if (err) {
				fail(err);
				return;
			}

			function group(list) {
				var sorted = _.sortBy(list, function(submission) {
					return submission.time.contest;
				});
				sorted = _.groupBy(sorted, function(submission) {
					return submission.problemNumber;
				});
				success(sorted);
			}

			function loopAsync(i) {
				if (i == submissions.length) {
					group(submissions);
				} else {
					submissions[i].denormalize(function(denormalized) { 
						submissions[i] = denormalized;
						loopAsync(i+1);
					});
				}
			}

			loopAsync(0);
		});
	},

	create: function(body,success, fail) {
		var submission = new Submission();

		submission.number = body.number;
		submission.teamId = body.teamId;
		submission.problemId = body.problemId;
		submission.time.contest = body.time ? body.time.contest : 0;
		submission.time.global = body.time ? body.time.global : 0;
		submission.source = body.source;
		submission.judgement = body.judgement;

		submission.save(function(err, updatedSubmission) {
			if (err) {
				fail(err);
				return;
			}

			Team.findById(updatedSubmission.teamId, function(err, team) {
				if (err) {
					fail (err);
					return;
				}

				team.submissionIds.push(updatedSubmission._id);
				team.save();
			});

			updatedSubmission.denormalize(function(denormalized) {
				success(denormalized);
			});
		});
	},

	update: function(id, body, success, fail) {
		Submission.findById(new ObjectId(id), function(err, submission) {
			if (err) {
				fail(err);
				return;
			}

			submission.number = body.number || submission.number;
			submission.teamId = body.teamId || submission.teamId;
			submission.problemId = body.problemId || submission.problemId;
			submission.time.contest = body.time.contest || submission.time.contest;
			submission.time.global = body.time.global || submission.time.global;
			submission.source = body.source || submission.source;
			submission.judgement = body.judgement || submission.judgement;

			submission.save(function(err, updatedSubmission) {
				if (err) {
					fail(err);
					return;
				}

				updatedSubmission.denormalize(function(denormalized) {
					success(denormalized);
				});
			});
		});
	},

	delete: function(id, success, fail) {
		Submission.remove({
			_id : id
		}, function(err, submission) {
			if (err) {
				fail(err);
				return;
			}

			success(submission);
		});
	}
}
