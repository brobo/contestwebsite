var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var appealsSchema = new Schema({
	team: Schema.Types.ObjectId,
	submission: Schema.Types.ObjectId,
	complaint: String,
	response: String
});

var problemSchema = new Schema({
	name: String
});

var submissionSchema = new Schema({
	team: Schema.Types.ObjectId,
	problem: Schema.Types.ObjectId,
	source: String,
	correct: Boolean
});

var teamSchema = new Schema({
	number: Integer,
	school: String,
	members: [{
		name: String,
		writtenScore: Integer
	}],
	pizza: {
		paid: Boolean,
		order: [{
			type: Schema.Types.ObjectId,
			quantity: Integer
		}]
	},
	submissions: [Schema.Types.ObjectId]
});
