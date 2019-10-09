const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const groupSchema = new Schema({
    name: {type: String, required: true, unique: true},
    thumbnail: String,
    admin: String,
    users: [{name: String, id: String, isAdmin: Boolean}],
});

const Group = mongoose.model('group', groupSchema);

module.exports = Group;