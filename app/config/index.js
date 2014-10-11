module.exports = function() {
	return {
		mode: 'local',
		port: 80,
		db: {
			server: 'localhost',
			port: 27017,
			name: "slhscscontest"
		}
	};
}
