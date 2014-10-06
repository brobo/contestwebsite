var rek = require('rekuire');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Submission = rek('submission.model.js');
var Team = rek('team.model.js');

var appealSchema = new Schema({
	submissionId: Schema.Types.ObjectId,
	complaint: String,
	response: String
});

appealSchema.methods.denormalize = function(callback, recurse) {
	if (recurse == 0) {
		callback(this);
		return;
	}
	recurse = recurse || 2;

	var appeal = this.toObject();

	Submission.findById(appeal.submissionId, function(err, submission) {
		appeal.submission = submission;
		appeal.submission.denormalize(function() {
			callback(appeal);
		}, recurse-1);
	});
};

module.exports = mongoose.model('Appeal', appealSchema);
