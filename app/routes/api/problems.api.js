var rek = require('rekuire');
var Problem = rek('problem.model.js');

module.exports = {
	getById: function(id, success, fail) {
		Problem.findById(id, function(err, problem) {
			if (err)
				fail(err);

			success(problem);
		});
	},

	get: function(success, fail) {
		Problem.find(function(err, problems) {
			if (err)
				fail(err);

			success(problems);
		});
	},

	create: function(body, success, fail) {
		var problem = new Problem();

		problem.name = body.name;

		problem.save(function(err, updatedProblem) {
			if (err)
				fail(err);

			success(updatedProblem);
		});
	},

	update: function(id, body, success, fail) {
		Problem.findById(id, function(err, problem) {
			if (err)
				fail(err);

			problem.number = body.number || problem.number;
			problem.name = body.name || problem.name;

			problem.save(function(err, updatedProblem) {
				if (err)
					fail(err);

				success(updateProblem);
			});
		});
	},

	delete: function(id, success, fail) {
		Problem.remove({
			_id : id
		}, function(err, problem) {
			if (err)
				fail(err);

			success(problem);
		});
	}
}
