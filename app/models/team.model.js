var rek = require('rekuire');
var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var Submission = rek('submission.model.js');
var Pizza = rek('pizza.model.js');

var Schema = mongoose.Schema;
var ObjectId = mongoose.Types.ObjectId;

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
	submissionIds: [Schema.Types.ObjectId]
});

teamSchema.plugin(autoIncrement.plugin, {
	model: 'Team',
	field: 'number',
	startAt: 1
});

teamSchema.methods.denormalize = function(callback, recurse) {
	var team = this;
	if (recurse == 0) {
		callback(team);
		return;
	}
	recurse = recurse || 2;

	var team = team.toObject();

	team.submissions = [];

	function loopPizzaAsync(i, finish) {
		if (i == team.pizza.order.length) {
			finish(team);
		} else {
			Pizza.findById(pizza.order[i].typeId, function(err, pizza) {
				team.pizza.order[i].type = pizza;
				loopPizzaAsync(i+1, finish);
			});
		}
	}

	function loopSubmissionAsync(i, finish) {
		if (i == team.submissionIds.length) {
			finish(team);
		} else {
			Submission.findById(new ObjectId(team.submissionIds[i]), function(err, submission) {
				submission.denormalize(function(denormalized) {
					team.submissions[i] = denormalized;
					loopSubmissionAsync(i+1, finish);
				}, recurse-1);
			});
		}
	}

	loopPizzaAsync(0, function() { 
		loopSubmissionAsync(0, function() {
			callback(team);
		});
	});
};

module.exports = mongoose.model('Team', teamSchema);
