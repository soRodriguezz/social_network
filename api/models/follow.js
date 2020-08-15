'use strict'

const mongoose = require('mongoose');
const Squema = mongoose.Schema;

const FollowSchema = Squema({
    user: { type: Schema.ObjectId, ref: 'User'},
    followed: { type: Schema.ObjectId, ref: 'User'}
});

module.exports = mongoose.model('Follow', FollowSchema);