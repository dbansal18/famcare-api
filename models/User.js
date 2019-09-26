const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    userid: {type: Number, required: true, unique: true},
    name: {type: String, required: true},
    password: {type: String, required: true},
    thumbnail: String,
    dob: String,
    gender: String,
    role: String,
    post: [{postId: String, postedAt: Date, desc: String}],
});

const User = mongoose.model('user', userSchema);

module.exports = User;