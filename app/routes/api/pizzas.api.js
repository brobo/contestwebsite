var rek = require('rekuire');
var Pizza = rek('pizza.model.js');

module.exports = {

	getById: function(id, success, fail) {
		Pizza.findById(id, function(err, pizza) {
			if (err) {
				fail(err);
				return;
			}

			success(pizza);
		});
	},

	get: function(success, fail) {
		Pizza.find(function(err, pizzas) {
			if (err) {
				fail(err);
				return;
			}

			success(pizzas);
		});
	},

	create: function(body, success, fail) {
		var pizza = new Pizza();

		pizza.name = body.name;
		pizza.price = body.price;

		pizza.save(function(err, updatedPizza) {
			if (err) {
				fail(err);
				return;
			}

			success(updatedPizza);
		})
	},

	update: function(id, body, success, fail) {
		Pizza.findById(id, function(err, pizza) {

			if (err) {
				fail(err);
				return;
			}

			pizza.name = body.name || pizza.name;
			pizza.price = body.price || pizza.price;

			pizza.save(function(err, updatedPizza) {
				if (err) {
					fail(err);
					return;
				}

				success(updatedPizza);
			});
		});
	},

	delete: function(id, success, fail) {
		Pizza.remove({
			_id : id
		}, function(err, pizza) {
			if (err) {
				fail(err);
				return;
			}

			success(pizza);
		});
	}
}
