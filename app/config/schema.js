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
