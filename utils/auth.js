var User = require('./../models/User');

const authUser = (authKey) => {
	return new Promise((resolve, reject) => {
		User.findOne({authCode: authKey}).then((user) => {
			resolve(user);
		}).catch((err) => {
			reject(err);
		})
	});
}

module.exports = authUser;