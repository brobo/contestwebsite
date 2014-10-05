var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var submissionSchema = new Schema({
	number: Number,
	teamId: Schema.Types.ObjectId,
	problemId: Schema.Types.ObjectId,
	time: {
		contest: Number,
		global: Number
	}
	source: String,
	judgement: String
});

module.exports = mongoose.model('Submission', submissionSchema);
