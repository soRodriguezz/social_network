'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//definir schema / collecion de la base de datos
var PublicationSchema = Schema({
    user: { type: Schema.ObjectId, ref: 'User'},
    text: String,
    file: String,
    create_at: String
});

module.exports = mongoose.model('Publication', PublicationSchema);