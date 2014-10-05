var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var pizzaSchema = new Schema({
	name: String,
	price: Number
});

module.exports = mongoose.model('pizzas', pizzaSchema);
