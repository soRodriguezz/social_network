'use strict'

const mongoose = require('mongoose');
const Squema = mongoose.Schema;

const MessageSchema = Squema({
    text: String,
    created_at: String,
    emmiter: { type: Schema.ObjectId, ref: 'User'},
    receiver: { type: Schema.ObjectId, ref: 'User'}
});

module.exports = mongoose.model('Message', MessageSchema);