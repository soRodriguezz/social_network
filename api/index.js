// Conexion a la base de datos MongoDB
'use strict'

var app = require('./app')
var mongoose = require('mongoose');
var port = 3800;

// Conexion database
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://192.168.0.26:27017/curso_mean_social', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("La conexion a la base de datos es correcta");
        // crear servidor
        app.listen(port, () => {
            console.log('servidor corriendo en http://localhost:3800');
        })
    })
    .catch(err => console.log(err));