'use strict'

var express = require('express');
var bodyParser = require('body-parser');

//cargar framework
var app = express();

//cargar rutas

//cargar middlewares
app.use(bodyParser.urlencoded({extended: false}));
// convertir lo que llega en el body a JSON
app.use(bodyParser.json());

//cors

//rutas
app.get('/', (req, res) => {
    res.status(200).send({
        message: 'Hola mundo / raiz'
    });
});

app.get('/pruebas', (req, res) => {
    res.status(200).send({
        message: 'Pruebas servidor NodeJS'
    });
});

//exportar
module.exports = app;