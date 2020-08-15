'use strict'
const mongoose = require('mongoose');
const app = require('./app');


// puerto del servidor
const port = 3800;

// * Conexion a MongoDB
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/nsocial', { useUnifiedTopology: true, useNewUrlParser: true })
    .then (() => {
        console.log('La conexion con la base de datos es exitosa');
    // Creacion del servidor
        app.listen(port, () => {
            console.log('Servidor en http://localhost:3800');
        })
    })
    .catch(err => console.log(err));
