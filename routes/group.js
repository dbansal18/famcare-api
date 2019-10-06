var express = require('express');
var router = express.Router();
const authUser = require('./../utils/auth');
const Group = require('./../models/Group');
const User = require('./../models/User');

var groupid = 0;

const headerCheck = (req, res, next) => {
	if(req.headers.authorization) next();
	else res.status(401).json({messsage: 'Authorization headers are not present'});
}

router.get('/', headerCheck, (req, res, next) => {
	authUser(req.headers.authorization)
		.then((user) => {
			Group.find().then((groups) => {
				res.send(groups);
			}).catch((err) => res.status(404).json(err));
		})
})

router.post('/', headerCheck, (req, res, next) => {
	if(!req.body.groupName || !req.body.image) res.status(403).json({messsage: 'Fill group name and image'});
	else
		authUser(req.headers.authorization)
			.then((user) => {
				new Group({
				    name: req.body.groupName,
				    thumbnail: req.body.image,
				    users: [{name: user.name, id: user._id, isAdmin: 1}],
				}).save().then((group) => {
					user.groups.push({id: group._id, name: group.name})
					user.save().then((updatedUser) => {
						res.status(200).json({user: updatedUser, group: group});
					}).catch((err) => console.log('2', err));
				})
			})
			.catch((err) => {
				console.log('1', err)
			});
});

module.exports = router;
