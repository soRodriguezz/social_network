'use strict'
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const app = express();

//CARGAR RUTAS
const user_routes = require('./routes/user');

//MIDDLEWARES
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('dev'));

//CORES

//RUTAS
app.use('/api', user_routes);

// Exportar configuracion
module.exports = app;