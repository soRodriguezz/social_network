'use strict'
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const app = express();

//CARGAR RUTAS
const user_routes = require('./routes/user');
const follow_routes = require('./routes/follow');

//MIDDLEWARES
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('dev'));

//CORES

//ROUTES
app.use('/api', user_routes);
app.use('/api', follow_routes);

// EXPORTS SETTINGS
module.exports = app;