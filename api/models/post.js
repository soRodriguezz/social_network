'use strict'

const mongoose = require('mongoose');
const Squema = mongoose.Schema;

const PostSchema = Squema({
    text: String,
    file: String,
    created_at: String,
    user: { type: Schema.ObjectId, ref: 'User'}
});

module.exports = mongoose.model('Post', PostSchema);