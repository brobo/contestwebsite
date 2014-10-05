var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var appealsSchema = new Schema({
	team: Schema.Types.ObjectId,
	submission: Schema.Types.ObjectId,
	complaint: String,
	response: String
});
