'use strict'

var User = require('../models/user');

function home (req, res){
    res.status(200).send({ message: 'Hola mundo / raiz' });
}

function pruebas (req, res){
    console.log(req.body);
    res.status(200).send({ message: 'Pruebas servidor NodeJS' });
}

module.exports = {
    home,
    pruebas
}