'use strict'

var express = require('express');
var bodyParser = require('body-parser');

//cargar framework
var app = express();

//cargar rutas
var user_routes = require('./routes/user');
//cargar middlewares
app.use(bodyParser.urlencoded({extended: false}));
// convertir lo que llega en el body a JSON
app.use(bodyParser.json());

//cors

//rutas
app.use('/api', user_routes);

//exportar
module.exports = app;