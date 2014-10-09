var rek = require('rekuire');
var _ = require('underscore');

var Submission = rek('submission.model.js');
var Team = rek('team.model.js');

var ObjectId = require('mongoose').Types.ObjectId;

module.exports = function(app) {

	app.get('/api/submissions/:submission_id', function(req, res) {
		Submission.findById(new ObjectId(req.params.submission_id), function(err, submission) {
			if (err)
				res.send(err);

			submission.denormalize(function(denormalized) {
				res.json(denormalized);
			});
		});
	});

	app.get('/api/submissions', function(req, res) {
		Submission.find(function(err, submissions) {
			if (err)
				res.send(err);

			function group(list) {
				var sorted = _.sortBy(list, function(submission) {
					return submission.time.contest;
				});
				sorted = _.groupBy(sorted, function(submission) {
					return submission.problemNumber;
				});
				res.json(sorted);
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
	});

	app.post('/api/submissions', function(req, res) {
		var submission = new Submission();

		submission.number = req.body.number;
		submission.teamId = req.body.teamId;
		submission.problemId = req.body.problemId;
		submission.time.contest = req.body.time ? req.body.time.contest : 0;
		submission.time.global = req.body.time ? req.body.time.global : 0;
		submission.source = req.body.source;
		submission.judgement = req.body.judgement;

		submission.save(function(err, updatedSubmission) {
			if (err)
				res.send(err);

			Team.findById(updatedSubmission.teamId, function(err, team) {
				if (!err) {
					team.submissionIds.push(updatedSubmission._id);
					team.save();
				}
			});

			updatedSubmission.denormalize(function(denormalized) {
				res.json(denormalized);
			});
		});
	});

	app.put('/api/submissions/:submission_id', function(req, res) {
		Submission.findById(new ObjectId(req.params.submission_id), function(err, submission) {
			if (err)
				res.send(err);

			submission.number = req.body.number || submission.number;
			submission.teamId = req.body.teamId || submission.teamId;
			submission.problemId = req.body.problemId || submission.problemId;
			submission.time.contest = req.body.time.contest || submission.time.contest;
			submission.time.global = req.body.time.global || submission.time.global;
			submission.source = req.body.source || submission.source;
			submission.judgement = req.body.judgement || submission.judgement;

			submission.save(function(err, updatedSubmission) {
				if (err)
					res.send(err);

				updatedSubmission.denormalize(function(denormalized) {
					res.json(denormalized);
				});
			});
		});
	});

	app.delete('/api/submissions/:submission_id', function(req, res) {
		Submission.remove({
			_id : req.params.submission_id
		}, function(err, submission) {
			if (err)
				res.send(err);

			req.json(submission);
		});
	});
}
