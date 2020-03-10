'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = 3800;

// Conexion database
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/social_network', { useNewUrlParser: true })
    .then(() => {
        console.log("Conexion correcta");

        // Crear servidor
        app.listen(port, () => {
            console.log("Servidor corriendo en http://localhost:3800");
        });
    })
    .catch(err => console.log(err));