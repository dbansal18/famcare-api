var User = require('./../models/User');

const authUser = (authKey) => {
	return new Promise((resolve, reject) => {
		User.findOne({authCode: authKey}).then((user) => {
			if(user) resolve(user);
			else reject()
		})
	});
}

module.exports = authUser;