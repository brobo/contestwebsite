var rek = require('rekuire');

module.exports = {
	appeals: rek('appeals.api.js'),
	members: rek('members.api.js'),
	pizzas: rek('pizzas.api.js'),
	problems: rek('problems.api.js'),
	submissions: rek('submissions.api.js'),
	teams: rek('teams.api.js')
};