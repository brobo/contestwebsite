var rek = require('rekuire');
var Submission = rek('submission.model.js');

module.exports = function(app) {

	app.get('/api/submissions/:submission_id', function(req, res) {
		Submission.findById(req.params.submission_id, function(err, submission) {
			if (err)
				res.send(err);

			submission.denormalize();

			res.json(submission);
		});
	});

	app.get('/api/submissions', function(req, res) {
		Submission.find(function(err, submissions) {
			if (err)
				res.send(err);

			for (var i=0; i<submissions.length; i++) {
				submissions[i].denormalize();
			}

			res.json(submissions);
		});
	});

	app.post('/api/submissions', function(req, res) {
		var problem = new Submission();

		submission.number = req.body.number;
		submission.problemId = req.body.problemId;
		submission.time.contest = req.body.time.contest;
		submission.time.global = req.body.time.global;
		submission.source = req.body.source;
		submission.judgement = req.body.judgement;

		submission.save(function(err, updatedSubmission) {
			if (err)
				res.send(err);

			updatedSubmission.denormalize();

			res.json(updatedSubmission);
		});
	});

	app.put('/api/submissions/:submission_id', function(req, res) {
		Submission.findById(req.params.submission_id, function(err, submission) {
			if (err)
				res.send(err);

			submission.number = req.body.number || submission.number;
			submission.problemId = req.body.problemId || submission.problemId;
			submission.time.contest = req.body.time.contest || submission.time.contest;
			submission.time.global = req.body.time.global || submission.time.global;
			submission.source = req.body.source || submission.source;
			submission.judgement = req.body.judgement || submission.judgement;

			submission.save(function(err, updatedSubmission) {
				if (err)
					res.send(err);

				updatedSubmission.denormalize();

				res.json(updateSubmission);
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
