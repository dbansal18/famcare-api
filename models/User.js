const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Group = require('./Group');

const userSchema = new Schema({
    userid: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true},
    name: {type: String, required: true},
    thumbnail: String,
    dob: String,
    gender: String,
    role: String,
    groups: [{id: String, name: String}],
    authCode: String,
});

const User = mongoose.model('user', userSchema);

module.exports = User;