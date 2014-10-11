var rek = require('rekuire');
var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var Submission = rek('submission.model.js');
var Pizza = rek('pizza.model.js');
var _ = require('underscore');

var Schema = mongoose.Schema;
var ObjectId = mongoose.Types.ObjectId;

var teamSchema = new Schema({
	number: Number,
	password: String,
	school: String,
	division: String,
	members: [{
		name: String,
		writtenScore: Number
	}],
	pizza: {
		paid: Boolean,
		ordered: Boolean,
		cheese: Number,
		pepperoni: Number,
		sausage: Number
	}
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
	if(!team.pizza) {
		team.pizza = { cheese: 0, pepperoni: 0, sausage: 0 };
	}

	if(!team.members) {
		team.members = [];
	}

	for(var mem = 0; mem < team.members.length; mem++) {
		team.members[mem].cid = team.number * 3 + mem;
	}

	function loopSubmissionAsync(finish) {
		Submission.find({teamId: team._id }, function(err, submissions) {
			for(var count = 0; count < submissions.length; count++) {
				submissions[count].denormalize(function(denormalized) {
					team.submissions[count] = denormalized;
				}, recurse-1);
			}

			finish(team);
		});
	}

	loopSubmissionAsync(function(res) {
		res.programming = _.reduce(res.submissions, function(memo, submission) {
			if (!memo[submission.problemNumber])
				memo[submission.problemNumber] = {solved: false, incorrect: 0};

			if (submission.judgement == "CORRECT")
				memo[submission.problemNumber].solved = true;
			else
				memo[submission.problemNumber].incorrect++;

			return memo;
		}, {});

		res.programmingScore = _.reduce(res.programming, function(memo, inst) {
			return memo + (inst.solved ? Math.max(40 - inst.incorrect * 5, 0) : 0);
		}, 0);

		res.writtenScore = _.reduce(res.members, function(memo, member) {
			return memo + member.writtenScore;
		}, 0);

		res.totalScore = res.writtenScore + res.programmingScore;

		res.pizza.total = (res.pizza.cheese + res.pizza.pepperoni + res.pizza.sausage);
		res.pizza.cost = res.pizza.total * 12;

		callback(res);
	});
};

teamSchema.statics.findByNumber = function(number, callback) {
	return this.findOne({number: number}, callback);
};

module.exports = mongoose.model('Team', teamSchema);
