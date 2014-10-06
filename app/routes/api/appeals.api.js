var rek = require('rekuire');
var Appeal = rek('appeal.model.js');

module.exports = function(app) {

	app.get('/api/appeals/:appeal_id', function(req, res) {
		Appeal.findById(req.params.appeal_id, function(err, appeal) {
			if (err)
				res.send(err);

			appeal.denormalize(function(denormalized) {
				res.json(denormalized);
			});
		});
	});

	app.get('/api/appeals', function(req, res) {
		Appeal.find(function(err, appeals) {
			if (err)
				res.send(err);

			for (var i=0; i<appeals.length; i++) {
				appeals[i].denormalize();
			}

			function loopAsync(i) {
				if (i == appeals.length) {
					res.json(appeals);
				} else {
					appeals[i].denormalize(function(){ loopAsync(i+1) });
				}
			}

			loopAsync(0);
		});
	});

	app.post('/api/appeals', function(req, res) {
		var appeal = new Appeal();

		appeal.submissionId = req.body.submissionId;
		appeal.complaint = req.body.complaint;
		appeal.response = req.body.response;

		appeal.save(function(err, updatedAppeal) {
			if (err)
				res.send(err);

			updatedAppeal.denormalize(function(denormalized) {
				res.json(denormalized);
			});
		});
	});

	app.put('/api/appeals/:appeal_id', function(req, res) {
		Appeal.findById(req.params.appeal_id, function(err, appeal) {
			if (err)
				res.send(err);

			appeal.submissionId = req.body.submissionId || submissionId;
			appeal.complaint = req.body.complaint || complaint;
			appeal.response = req.body.response || response;

			appeal.save(function(err, updatedAppeal) {
				if (err)
					res.send(err);

				updatedAppeal.denormalize(function(denormalized) {
					res.json(denormalized);
				});
			});
		});
	});

	app.delete('/api/appeals/:appeal_id', function(req, res) {
		Appeal.remove({
			_id : req.params.appeal_id
		}, function(err, appeal) {
			if (err)
				res.send(err);

			req.json(appeal);
		});
	});
}
