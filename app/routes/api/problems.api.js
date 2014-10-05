var rek = require('rekuire');
var Problem = rek('problem.model.js');

module.exports = function(app) {

	app.get('/api/problem/:problem_id', function(req, res) {
		Problem.findById(req.params.problem_id, function(err, problem) {
			if (err)
				res.send(err);

			res.json(problem);
		});
	});

	app.get('/api/problems', function(req, res) {
		Problem.find(function(err, problems) {
			if (err)
				res.send(err);

			res.json(problems);
		});
	});

	app.post('/api/problems', function(req, res) {
		var problem = new Problem();

		problem.name = req.body.name;

		problem.save(function(err, updatedProblem) {
			if (err)
				res.send(err);

			res.json(updatedProblem);
		});
	});

	app.put('/api/problems/:problem_id', function(req, res) {
		Problem.findById(req.params.problem_id, function(err, problem) {
			if (err)
				res.send(err);

			problem.number = req.body.number || problem.number;
			problem.name = req.body.name || problem.name;

			problem.save(function(err, updatedProblem) {
				if (err)
					res.send(err);

				res.json(updateProblem);
			});
		});
	});

	app.delete('/api/problems/:problem_id', function(req, res) {
		Problem.remove({
			_id : req.params.problem_id
		}, function(err, problem) {
			if (err)
				res.send(err);

			req.json(problem);
		});
	});
}
