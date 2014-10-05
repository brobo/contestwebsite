var rek = require('rekuire');
var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var Schema = mongoose.Schema;

var Pizza = rek('pizza.model.js');

var teamSchema = new Schema({
	number: Number,
	school: String,
	division: String,
	members: [{
		name: String,
		writtenScore: Number
	}],
	pizza: {
		paid: Boolean,
		order: [{
			typeId: Schema.Types.ObjectId,
			quantity: Number
		}]
	},
	// submissionIds: [Schema.Types.ObjectId]
});

teamSchema.plugin(autoIncrement.plugin, {
	model: 'Team',
	field: 'number',
	startAt: 1
});

teamSchema.methods.denormalize = function() {
	for (var i=0; i<pizza.order.length; i++) {
		Pizza.findById(pizza.order[i].typeId, function(err, pizza) {
			pizza.order[i].type = pizza;
		});
	}
};

module.exports = mongoose.model('Team', teamSchema);