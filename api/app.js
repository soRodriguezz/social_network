'use strict'
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const app = express();

//CARGAR RUTAS


//MIDDLEWARES
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('dev'));

//CORES


//RUTAS
app.get('/', (req, res) => {
    res.status(200).send({ message: 'Raiz del proyecto'});
});

app.get('/test', (req, res) => {
    res.status(200).send({ message: 'Ruta test'});
});

// Exportar configuracion
module.exports = app;