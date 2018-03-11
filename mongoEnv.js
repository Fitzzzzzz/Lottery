const env = {
	mongoPort: 27017,
	mongoHost: 'mongodb://localhost',
	dbInfo: {
		dbName: 'lottery',
		userCol: 'user',
		lotteryCol: 'lottery'
	}
};

module.exports = env;