'use strict'
const mongoose = require('mongoose');
const app = require('./app');

// Puerto del servidor
app.set('port', process.env.PORT || 3800);

// * Conexion a MongoDB
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/nsocial', { useUnifiedTopology: true, useNewUrlParser: true })
    .then (() => {
        //console.log('La conexion con la base de datos es exitosa');
        // Creacion del servidor
        app.listen(app.set('port'), () => {
            console.log('Servidor en http://localhost:' + app.set('port'));
        })
    })
    .catch(err => console.log(err));
