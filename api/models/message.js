'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//definir schema / collecion de la base de datos
var MessageSchema = Schema({
    emitter: { type: Schema.ObjectId, ref: 'User'},
    receiver: { type: Schema.ObjectId, ref: 'User'},
    text: String,
    create_at: String
});

module.exports = mongoose.model('Message', MessageSchema);