module.exports = function() {
	return {
		mode: 'local',
		port: 3000,
		db: {
			server: 'localhost',
			port: 27017,
			name: "slhscscontest"
		}
	};
}
