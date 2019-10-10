var express = require('express');
var router = express.Router();
const authUser = require('./../utils/auth');
const Group = require('./../models/Group');
const User = require('./../models/User');

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
		}).catch((err) => res.status(401).json({messsage: 'Unauthorized'}));
})

router.post('/', headerCheck, (req, res, next) => {
	if(!req.body.groupName) res.status(403).json({messsage: 'Fill group name'});
	else
		authUser(req.headers.authorization)
			.then((user) => {
				new Group({
				    name: req.body.groupName,
				    thumbnail: req.body.image,
				    admin: user._id,
				    users: [{name: user.name, id: user._id, email: user.email, isAdmin: 1}],
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

router.post('/invite', headerCheck, (req, res) => {
	if(!req.body.email || !req.body.group) res.status(403).json({messsage: 'Fill all the required details'});
	else
		authUser(req.headers.authorization)
			.then((user) => {
				Group.findOne({_id: req.body.group}, (err, group) => {
					if(err) res.status(403).json({error: err});
					if(group) {
						if(group.admin == user._id) {
							User.findOne({email: req.body.email}, (err, invitedUser) => {
								if(err) res.status(404).json({messsage: err});
								if(invitedUser) {
									group.users.push({name: invitedUser.name, id: invitedUser._id, email: invitedUser.email, isAdmin: 0});
									group.save().then((updatedGroup) => {
										invitedUser.groups.push({id: updatedGroup._id, name: updatedGroup.name});
										invitedUser.save().then((updatedUser) => res.send({group: updatedGroup}));
									})
								}
							})
						} else res.status(401).json({messsage: 'You are not admin of this group'});
					}
				})
			})
})

module.exports = router;
