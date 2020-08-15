'use strict'

const mongoose = require('mongoose');
const Squema = mongoose.Schema;

const UserSchema = Squema({
    name: String,
    surname: String,
    nick: String,
    email: String,
    password: String,
    role: String,
    image: String
});

module.exports = mongoose.model('User', UserSchema);