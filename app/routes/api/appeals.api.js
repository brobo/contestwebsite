var rek = require('rekuire');
var Appeal = rek('appeal.model.js');

module.exports = {
	getById: function(id, success, fail) {
		Appeal.findById(id, function(err, appeal) {
			if (err) {
				fail(err);
				return;
			}

			appeal.denormalize(success);
		});
	},

	getAll: function(success, fail) {
		Appeal.find(function(err, appeals) {
			if (err) {
				fail(err);
				return;
			}

			for (var i=0; i<appeals.length; i++) {
				appeals[i].denormalize();
			}

			function loopAsync(i) {
				if (i == appeals.length) {
					success(appeals);
				} else {
					appeals[i].denormalize(function(){ loopAsync(i+1) });
				}
			}

			loopAsync(0);
		});
	},

	create: function(body, success, fail) {
		var appeal = new Appeal();

		appeal.submissionId = body.submissionId;
		appeal.complaint = body.complaint;
		appeal.response = body.response;

		appeal.save(function(err, updatedAppeal) {
			if (err) {
				fail(err);
				return;
			}

			updatedAppeal.denormalize(success);
		});
	},

	update: function(id, body, success, fail) {
		Appeal.findById(id, function(err, appeal) {
			if (err) {
				fail(err);
				return;
			}

			appeal.submissionId = body.submissionId || submissionId;
			appeal.complaint = body.complaint || complaint;
			appeal.response = body.response || response;

			appeal.save(function(err, updatedAppeal) {
				if (err) {
					fail(err);
					return;
				}

				updatedAppeal.denormalize(function(denormalized) {
					success(denormalized);
				});
			});
		});
	},

	delete: function(id, success, fail) {
		Appeal.remove({
			_id : id
		}, function(err, appeal) {
			if (err) {
				fail(err);
				return;
			}

			success(appeal);
		});
	}
}
