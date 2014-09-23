var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var submissionSchema = new Schema({
	team: Schema.Types.ObjectId,
	problem: Integer,
	correct: Boolean
});

var teamSchema = new Schema({
	number: Integer,
	school: String,
	competitors: [{
		name: String,
		written: Integer
	}],
	pizzas: [{
		type: String,
		quantity: Integer
	}],
	programming: Integer,
	submissions: [Schema.Types.ObjectId]
});