const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const groupSchema = new Schema({
    groupid: {type: Number, required: true, unique: true},
    name: {type: String, required: true},
    thumbnail: String,
    users: [{name: String, id: String}],
});

const Group = mongoose.model('group', groupSchema);

module.exports = Group;