var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var Schema = mongoose.Schema;

var problemSchema = new Schema({
	number: Number,
	name: String
});

problemSchema.plugin(autoIncrement.plugin, {
	model: 'Problem',
	field: 'number',
	startAt: 1
});

problemSchema.statics.findByNumber = function findByNumber(number, cb) {
	return this.findOne({number: number}, cb);
};

module.exports = mongoose.model('Problem', problemSchema);
