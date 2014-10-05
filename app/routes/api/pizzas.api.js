var rek = require('rekuire');
var Pizza = rek('pizza.model.js');

module.exports = function(app) {

	app.get('/api/pizzas/:pizza_id', function(req, res) {
		Pizza.findById(req.params.pizza_id, function(err, pizza) {
			if (err)
				res.send(err);

			res.json(pizza);
		});
	});

	app.get('/api/pizzas', function(req, res) {
		Pizza.find(function(err, pizzas) {
			if (err)
				res.send(err);

			res.json(pizzas);
		});
	});

	app.post('/api/pizzas', function(req, res) {
		var pizza = new Pizza();

		pizza.name = req.body.name;
		pizza.price = req.body.price;

		pizza.save(function(err, updatedPizza) {
			if (err)
				res.send(err);

			res.json(updatedPizza);
		})
	});

	app.put('/api/pizzas/:pizza_id', function(req, res) {
		Pizza.findById(req.params.pizza_id, function(err, pizza) {

			if (err)
				res.send(err);

			pizza.name = req.body.name || pizza.name;
			pizza.price = req.body.price || pizza.price;

			pizza.save(function(err, updatedPizza) {
				if (err)
					res.send(err);

				res.json(updatedPizza);
			});
		});
	});

	app.delete('/api/pizzas/:pizza_id', function(req, res) {
		Pizza.remove({
			_id : req.params.pizza_id
		}, function(err, pizza) {
			if (err)
				res.send(err);

			req.json(pizza);
		});
	});
}
